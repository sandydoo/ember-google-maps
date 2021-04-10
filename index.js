/* eslint-disable prefer-template */

'use strict';

const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const path = require('path');
const chalk = require('chalk');
const Handlebars = require('handlebars');
const stripIndent = require('strip-indent');
const writeFile = require('broccoli-file-creator');
const BroccoliDebug = require('broccoli-debug');
const camelCase = require('camelcase');

const IS_COMPONENT = /components\//;

function intersection(a, b) {
  let intersection = new Set();

  for (let e of b) {
    if (a.has(e)) {
      intersection.add(e);
    }
  }

  return intersection;
}

function difference(a, b) {
  let difference = new Set(a);

  for (let e of b) {
    difference.delete(e);
  }

  return difference;
}

let dependencies = {
  circle: ['marker'],
};

function excludeComponent(included, excluded) {
  let shouldExclude = excludeName(included, excluded);

  return function (name) {
    if (!IS_COMPONENT.test(name)) {
      return false;
    }

    let baseName = path.basename(name).split('.').shift();

    return shouldExclude(baseName);
  };
}

function excludeName(included, excluded) {
  return function (rawName) {
    let name = camelCase(rawName),
      isIncluded = included.indexOf(name) !== -1,
      isExcluded = excluded.indexOf(name) !== -1;

    if (included.length === 0 && excluded.length === 0) {
      return false;
    }

    // Include if both included and excluded
    if (isIncluded && isExcluded) {
      return false;
    }

    // Only included
    if (included.length && excluded.length === 0) {
      return !isIncluded;
    }

    // Only excluded
    if (excluded.length && included.length === 0) {
      return isExcluded;
    }

    return !isIncluded || isExcluded;
  };
}

module.exports = {
  name: require('./package').name,

  options: {
    babel: {
      plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-optional-chaining',
      ],
    },
  },

  init() {
    this._super.init.apply(this, arguments);
    this.debugTree = BroccoliDebug.buildDebugCallback(
      `ember-google-maps:${this.name}`
    );
  },

  included() {
    this._super.included.apply(this, arguments);

    let app = this._findHost(),
      config = app.options['ember-google-maps'] || {};

    this.isProduction = app.isProduction;
    this.isDevelopment = !this.isProduction;

    let { only = [], except = [] } = config;

    only = only.map(camelCase);
    except = except.map(camelCase);

    let included = this.createIncludedList(only, except),
      excluded = this.createExcludedList(only, except);

    if (this.isProduction) {
      excluded.push('warnMissingComponent');
    }

    // Ensure that we include the base map components.
    if (included.length) {
      included.push('gMap', 'canvas', 'mapComponent', 'addonFactory');

      if (this.isDevelopment) {
        included.push('warnMissingComponent');
      }

      included.forEach((name) => {
        let deps = dependencies[name];

        if (deps) {
          included = included.concat(deps);
        }
      });
    }

    this.excludeName = excludeName(included, excluded);
    this.excludeComponent = excludeComponent(included, excluded);

    this.skipTreeshaking =
      (!included || included.length === 0) &&
      (!excluded || excluded.length === 0);
  },

  config(env, config) {
    let mapConfig = config['ember-google-maps'] || {};
    mapConfig['src'] = this.buildGoogleMapsUrl(mapConfig);

    return { 'ember-google-maps': mapConfig };
  },

  treeForAddon(tree) {
    tree = this.debugTree(tree, 'addon-tree:input');

    // let addonFactoryTree = this.createAddonFactoryTree('templates/components');
    // tree = new MergeTrees([tree, addonFactoryTree], { overwrite: true });
    // tree = this.debugTree(tree, 'addon-tree:with-addon-factory');

    tree = this.filterComponents(tree);
    tree = this.debugTree(tree, 'addon-tree:post-filter');

    // Run super now, which processes and removes `.hbs`` template files.
    tree = this._super.treeForAddon.call(this, tree);
    tree = this.debugTree(tree, 'addon-tree:post-super');

    return tree;
  },

  setupPreprocessorRegistry(_type, registry) {
    let plugin = this._canvasBuildPlugin();

    registry.add('htmlbars-ast-plugin', plugin);
  },

  _canvasBuildPlugin() {
    return {
      name: 'ember-google-maps:canvas-enforcer',
      plugin: require('./lib/broccoli/canvas-enforcer'),
      baseDir() {
        return __dirname;
      },
      parallelBabel: {
        requireFile: __filename,
        buildUsing: '_canvasBuildPlugin',
        params: {},
      },
    };
  },

  createAddonFactoryTree(templatePath) {
    let AddonRegistry = require('./lib/broccoli/addon-registry');

    let addons = new AddonRegistry(this.project).components.concat([
      { key: 'marker', component: 'g-map/marker' },
      { key: 'circle', component: 'g-map/circle' },
      { key: 'polyline', component: 'g-map/polyline' },
      { key: 'infoWindow', component: 'g-map/info-window' },
      { key: 'overlay', component: 'g-map/overlay' },
      { key: 'control', component: 'g-map/control' },
      { key: 'autocomplete', component: 'g-map/autocomplete' },
      { key: 'directions', component: 'g-map/directions' },
      { key: 'route', component: 'g-map/route' },
    ]);

    if (this.isProduction) {
      // Exclude components that we don't want in the production build.
      addons = addons.filter(({ key }) => !this.excludeName(key));
    } else {
      // Replace an excluded component with a debug component in development and
      // testing. This component should throw an assertion to warn the user of
      // misconfigured treeshaking.
      addons = addons.map((component) => {
        let { key } = component;

        if (this.excludeName(key)) {
          return {
            key,
            component: '-private-api/warn-missing-component',
          };
        }

        return component;
      });
    }

    let template = Handlebars.compile(
      stripIndent(`
      \\{{yield
          (hash
            {{#each addons as |addon|}}
              {{addon.key}}=(component "{{addon.component}}" map=map _internalAPI=_internalAPI _name="{{addon.key}}")
            {{/each}}
          )
        }}
    `)
    );

    return writeFile(
      `${templatePath}/-private-api/addon-factory.hbs`,
      template({ addons })
    );
  },

  filterComponents(tree) {
    if (this.skipTreeshaking) {
      return tree;
    }

    return new Funnel(tree, {
      exclude: [this.excludeComponent],
    });
  },

  createIncludedList(onlyList = [], exceptList = []) {
    let only = new Set(onlyList),
      except = new Set(exceptList);

    if (except && except.length) {
      return difference(only, except);
    }

    return Array.from(only);
  },

  createExcludedList(onlyList = [], exceptList = []) {
    let only = new Set(onlyList),
      except = new Set(exceptList);

    if (only && only.length) {
      return intersection(except, only);
    }

    return Array.from(except);
  },

  buildGoogleMapsUrl(config = {}) {
    let {
      baseUrl = '//maps.googleapis.com/maps/api/js',
      channel,
      client,
      key,
      language,
      libraries,
      protocol,
      region,
      version,
      mapIds,
    } = config;

    if (!key && !client) {
      // Since we allow configuring the URL at runtime, we don't throw an error
      // here.
      return '';
    }

    if (key && client) {
      this.warn(
        'You must specify either a Google Maps API key or a Google Maps Premium Plan Client ID, but not both. Learn more: https://ember-google-maps.sandydoo.me/docs/getting-started'
      );
    }

    if (channel && !client) {
      this.warn(
        'The Google Maps API channel parameter is only available when using a client ID, not when using an API key. Learn more: https://ember-google-maps.sandydoo.me/docs/getting-started'
      );
    }

    let src = baseUrl,
      params = [];

    if (version) {
      params.push('v=' + encodeURIComponent(version));
    }

    if (client) {
      params.push('client=' + encodeURIComponent(client));
    }

    if (channel) {
      params.push('channel=' + encodeURIComponent(channel));
    }

    if (libraries && libraries.length) {
      params.push('libraries=' + encodeURIComponent(libraries.join(',')));
    }

    if (region) {
      params.push('region=' + encodeURIComponent(region));
    }

    if (language) {
      params.push('language=' + encodeURIComponent(language));
    }

    if (key) {
      params.push('key=' + encodeURIComponent(key));
    }

    if (mapIds) {
      params.push('map_ids=' + encodeURIComponent(mapIds));
    }

    if (protocol) {
      src = protocol + ':' + src;
    }

    src += '?' + params.join('&');

    return src;
  },

  warn(message) {
    this.ui.writeLine(chalk.yellow(message));
  },
};
