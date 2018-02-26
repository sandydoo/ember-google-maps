/* eslint-env node */
'use strict';

const Funnel = require('broccoli-funnel');
const path = require('path');

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
  'info-window': ['detect-render']
};

module.exports = {
  name: 'ember-google-maps',

  included() {
    this._super.included.apply(this, arguments);

    const app = this._findHost();

    const config = app.options['ember-google-maps'] || {};
    this.whitelist = this.generateWhitelist(config);
    this.blacklist = this.generateBlacklist(config);

    // If a whitelist is used, ensure that we include the base map component.
    if (this.whitelist.length) {
      this.whitelist.push('g-map', 'canvas', 'base');
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
    let src = '//maps.googleapis.com/maps/api/js';
    let mapConfig = config['ember-google-maps'] || {};
    let params = [];

    let key = mapConfig.key;
    if (key) {
      params.push('key=' + encodeURIComponent(key));
    }

    let version = mapConfig.version;
    if (version) {
      params.push('v=' + encodeURIComponent(version));
    }

    let client = mapConfig.client;
    if (client) {
      params.push('client=' + encodeURIComponent(client));
    }

    let channel = mapConfig.channel;
    if (channel) {
      params.push('channel=' + encodeURIComponent(channel));
    }

    let libraries = mapConfig.libraries;
    if (libraries && libraries.length) {
      params.push('libraries=' + encodeURIComponent(libraries.join(',')));
    }

    let language = mapConfig.language;
    if (language) {
      params.push('language=' + encodeURIComponent(language));
    }

    let protocol = mapConfig.protocol;
    if (protocol) {
      src = protocol + ':' + src;
    }

    src += '?' + params.join('&');

    mapConfig['src'] = src;

    config['ember-google-maps'] = mapConfig;

    return config;
  },

  treeForAddon() {
    const tree = this._super.treeForAddon.apply(this, arguments);
    return this.filterComponents(tree);
  },

  treeForAddonTemplates() {
    const tree = this._super.treeForAddonTemplates.apply(this, arguments);
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

    let isWhiteListed = whitelist.indexOf(baseName) !== -1;
    let isBlackListed = blacklist.indexOf(baseName) !== -1;

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
  }
};
