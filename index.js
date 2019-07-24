/* eslint-disable prefer-template */

'use strict';

const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const path = require('path');
const chalk = require('chalk');
const Handlebars = require('handlebars');
const stripIndent = require('strip-indent');
const writeFile = require('broccoli-file-creator');
const camelCase = require('camelcase');

function intersection(a, b) {
  const intersection = new Set();
  for (let e of b) {
    if (a.has(e)) {
      intersection.add(e);
    }
  }
  return intersection;
}

function difference(a, b) {
  const difference = new Set(a);
  for (let e of b) {
    difference.delete(e);
  }
  return difference;
}

const dependencies = {
  'circle': ['marker'],
  'overlay': ['detectRender']
};

module.exports = {
  name: require('./package').name,

  options: {
    babel: {
      plugins: ['transform-object-rest-spread']
    }
  },

  included() {
    this._super.included.apply(this, arguments);

    const app = this._findHost();

    const config = app.options['ember-google-maps'] || {};

    if (config.only && config.only.length) {
      config.only = config.only.map(k => camelCase(k));
    }

    if (config.except && config.except.length) {
      config.except = config.except.map(k => camelCase(k));
    }

    this.whitelist = this.generateWhitelist(config);
    this.blacklist = this.generateBlacklist(config);

    // If a whitelist is used, ensure that we include the base map components.
    if (this.whitelist.length) {
      this.whitelist.push('gMap', 'canvas', 'mapComponent', 'addonFactory');
      this.whitelist.forEach((w) => {
        const deps = dependencies[w];
        if (deps) {
          this.whitelist = this.whitelist.concat(deps);
        }
      });
    }

    this.noFiltersDefined = (!this.whitelist || this.whitelist.length === 0) && (!this.blacklist || this.blacklist.length === 0);
  },

  config(env, config) {
    let mapConfig = config['ember-google-maps'] || {};
    mapConfig['src'] = this.buildGoogleMapsUrl(mapConfig);

    return { 'ember-google-maps': mapConfig };
  },

  treeForAddon() {
    let tree = this._super.treeForAddon.apply(this, arguments);
    return this.filterComponents(tree);
  },

  treeForAddonTemplates() {
    let AddonRegistry = require('./lib/broccoli/addon-registry');

    let addons = new AddonRegistry(this.project).components;

    addons = addons.concat([
      { key: 'marker', component: 'g-map/marker' },
      { key: 'circle', component: 'g-map/circle' },
      { key: 'polyline', component: 'g-map/polyline' },
      { key: 'infoWindow', component: 'g-map/info-window' },
      { key: 'overlay', component: 'g-map/overlay' },
      { key: 'control', component: 'g-map/control' },
      { key: 'autocomplete', component: 'g-map/autocomplete' },
      { key: 'directions', component: 'g-map/directions' },
      { key: 'route', component: 'g-map/route' }
    ]).filter(({ key }) => !this.excludeName(key, this.whitelist, this.blacklist));

    let template = Handlebars.compile(stripIndent(`
      \\{{yield
          (hash
            {{#each addons as |addon|}}
              {{addon.key}}=(component "{{addon.component}}" map=map _internalAPI=_internalAPI gMap=gMap)
            {{/each}}
          )
        }}
    `));

    let addonFactoryTree = writeFile('components/-private-api/addon-factory.hbs', template({ addons }));

    let tree = this._super.treeForAddonTemplates.apply(this, arguments);

    tree = new MergeTrees([tree, addonFactoryTree], { overwrite: true });

    return this.filterComponents(tree);
  },

  filterComponents(tree) {
    const whitelist = this.whitelist;
    const blacklist = this.blacklist;

    if (this.noFiltersDefined) {
      return tree;
    }

    return new Funnel(tree, {
      exclude: [(name) => this.excludeComponent(name, whitelist, blacklist)]
    });
  },

  excludeComponent(name, whitelist, blacklist) {
    const regex = /components\//;

    const isComponent = regex.test(name);
    if (!isComponent) {
      return false;
    }

    let baseName = path.basename(name);
    baseName = baseName.split('.').shift();

    return this.excludeName(baseName, whitelist, blacklist);
  },

  excludeName(rawName, whitelist, blacklist) {
    let name = camelCase(rawName);

    let isWhiteListed = whitelist.indexOf(name) !== -1;
    let isBlackListed = blacklist.indexOf(name) !== -1;

    if (whitelist.length === 0 && blacklist.length === 0) {
      return false;
    }

    // Include if both white- and blacklisted
    if (isWhiteListed && isBlackListed) {
      return false;
    }

    // Only whitelisted
    if (whitelist.length && blacklist.length === 0) {
      return !isWhiteListed;
    }

    // Only blacklisted
    if (blacklist.length && whitelist.length === 0) {
      return isBlackListed;
    }

    return !isWhiteListed || isBlackListed;
  },

  generateWhitelist(config) {
    const only = new Set(config.only || []);
    const except = new Set(config.except || []);

    if (except && except.length) {
      return difference(only, except);
    }

    return Array.from(only);
  },

  generateBlacklist(config) {
    const only = new Set(config.only || []);
    const except = new Set(config.except || []);

    if (only && only.length) {
      return intersection(except, only);
    }

    return Array.from(except);
  },

  buildGoogleMapsUrl(config) {
    config = config || {};

    if (!config.key && !config.client) {
      this.warn('You must provide either a Google Maps API key or a Google Maps Premium Plan Client ID to use ember-google-maps. Learn more: https://ember-google-maps.sandydoo.me/docs/getting-started');
    }

    if (config.key && config.client) {
      this.warn('You must specify either a Google Maps API key or a Google Maps Premium Plan Client ID, but not both. Learn more: https://ember-google-maps.sandydoo.me/docs/getting-started');
    }

    if (config.channel && !config.client) {
      this.warn('The Google Maps API channel parameter is only available when using a client ID, not when using an API key. Learn more: https://ember-google-maps.sandydoo.me/docs/getting-started');
    }

    let src = config.baseUrl || '//maps.googleapis.com/maps/api/js';
    const params = [];

    const version = config.version;
    if (version) {
      params.push('v=' + encodeURIComponent(version));
    }

    const client = config.client;
    if (client) {
      params.push('client=' + encodeURIComponent(client));
    }

    const channel = config.channel;
    if (channel) {
      params.push('channel=' + encodeURIComponent(channel));
    }

    const libraries = config.libraries;
    if (libraries && libraries.length) {
      params.push('libraries=' + encodeURIComponent(libraries.join(',')));
    }

    const region = config.region;
    if (region) {
      params.push('region=' + encodeURIComponent(region));
    }

    const language = config.language;
    if (language) {
      params.push('language=' + encodeURIComponent(language));
    }

    const key = config.key;
    if (key) {
      params.push('key=' + encodeURIComponent(key));
    }

    const protocol = config.protocol;
    if (protocol) {
      src = protocol + ':' + src;
    }

    src += '?' + params.join('&');

    return src;
  },

  warn(message) {
    this.ui.writeLine(chalk.yellow(message));
  }
};
