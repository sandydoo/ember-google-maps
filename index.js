/* eslint-disable prefer-template */

'use strict';

const Funnel = require('broccoli-funnel');
const chalk = require('chalk');
const BroccoliDebug = require('broccoli-debug');
const camelCase = require('camelcase');
const { createHash } = require('crypto');

const {
  newIncludedList,
  newExcludedList,
  newExcludeName,
  newExcludeComponent,
  skipTreeshaking,
} = require('./lib/treeshaking');

let dependencies = {
  circle: ['marker'],
};

let FOUND_GMAP_ADDONS = {};

let PARAMS_FOR_TREESHAKER = {
  included: null,
  excluded: null,
  isProduction: true,
};

function toHash(obj) {
  return createHash('sha256').update(JSON.stringify(obj)).digest('base64');
}

// Copied from @embroider/test-setup. We use this to figure out when Embroider used as the build system.
// https://github.com/embroider-build/embroider/blob/8b2c20d6dccb006c4cc51cb18504f5a489c948f2/packages/test-setup/src/index.ts#L98
function shouldUseEmbroider(app) {
  if (process.env.EMBROIDER_TEST_SETUP_FORCE === 'classic') {
    return false;
  }
  if (process.env.EMBROIDER_TEST_SETUP_FORCE === 'embroider') {
    return true;
  }
  return '@embroider/core' in app.dependencies();
}

module.exports = {
  name: require('./package').name,

  options: {
    babel: {
      plugins: [
        '@babel/plugin-proposal-logical-assignment-operators',
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

    // Treeshaking setup

    // Don’t manipulate the broccoli trees when using Embroider. Things will
    // break. Just clear out the template exports and Embroider will do the
    // rest.
    this.isUsingEmbroider = shouldUseEmbroider(app);

    let { only = [], except = [] } = config;

    only = only.map(camelCase);
    except = except.map(camelCase);

    let included = newIncludedList(only, except),
      excluded = newExcludedList(only, except);

    if (this.isProduction) {
      excluded.push('warnMissingComponent');
    }

    // Include the base map components and any dependencies
    if (included.length) {
      included.push('canvas', 'mapComponent');

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

    // Excluded components that depend on excluded ones
    if (excluded.length) {
      excluded.forEach((name) => {
        Object.entries(dependencies).forEach(([dependant, dependencies]) => {
          if (dependencies.includes(name)) {
            excluded.push(dependant);
          }
        });
      });
    }

    this.excludeName = newExcludeName(included, excluded);
    this.excludeComponent = newExcludeComponent(included, excluded);

    this.skipTreeshaking = skipTreeshaking(included, excluded);

    // Save treeshaking params for Babel
    Object.assign(PARAMS_FOR_TREESHAKER, {
      included: included,
      excluded: excluded,
      isProduction: this.isProduction,
    });

    // Get “addons for this addon”™️
    Object.assign(FOUND_GMAP_ADDONS, this.getAddonsFromProject(this.project));
  },

  config(env, config) {
    let mapConfig = config['ember-google-maps'] || {};
    mapConfig['src'] = this.buildGoogleMapsUrl(mapConfig);

    return { 'ember-google-maps': mapConfig };
  },

  treeForAddon(tree) {
    tree = this.debugTree(tree, 'addon-tree:input');

    if (!this.isUsingEmbroider) {
      tree = this.filterComponents(tree);
      tree = this.debugTree(tree, 'addon-tree:post-filter');
    }

    // Run super now, which processes and removes `.hbs`` template files.
    tree = this._super.treeForAddon.call(this, tree);
    tree = this.debugTree(tree, 'addon-tree:post-super');

    return tree;
  },

  setupPreprocessorRegistry(type, registry) {
    let canvasPlugin = this._canvasBuildPlugin();
    registry.add('htmlbars-ast-plugin', canvasPlugin);

    let addonFactoryPlugin = this._addonFactoryPlugin(FOUND_GMAP_ADDONS);
    registry.add('htmlbars-ast-plugin', addonFactoryPlugin);

    // We only need to run the treeshaker plugin on the addon, but it still
    // relies on data from the parent app.
    if (type === 'self') {
      let treeshakerPlugin = this._treeshakerPlugin(PARAMS_FOR_TREESHAKER);
      registry.add('htmlbars-ast-plugin', treeshakerPlugin);
    }
  },

  _addonFactoryPlugin(addons = {}) {
    const name = 'ember-google-maps:addon-factory';
    const AddonFactory = require('./lib/ast-transforms/addon-factory')(addons);

    return {
      name,
      plugin: AddonFactory,
      baseDir() {
        return __dirname;
      },
      cacheKey() {
        return `${name}:${toHash(FOUND_GMAP_ADDONS)}`;
      },
      parallelBabel: {
        requireFile: __filename,
        buildUsing: '_addonFactoryPlugin',
        params: FOUND_GMAP_ADDONS,
      },
    };
  },

  _treeshakerPlugin(params = {}) {
    const name = 'ember-google-maps:treeshaker';
    const Treeshaker = require('./lib/ast-transforms/treeshaker')(params);

    return {
      name,
      plugin: Treeshaker,
      baseDir() {
        return __dirname;
      },
      cacheKey() {
        return `${name}:${toHash(PARAMS_FOR_TREESHAKER)}`;
      },
      parallelBabel: {
        requireFile: __filename,
        buildUsing: '_treeshakerPlugin',
        params: PARAMS_FOR_TREESHAKER,
      },
    };
  },

  _canvasBuildPlugin() {
    const name = 'ember-google-maps:canvas-enforcer';

    return {
      name,
      plugin: require('./lib/ast-transforms/canvas-enforcer'),
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

  getAddonsFromProject(project) {
    const AddonRegistry = require('./lib/addons/registry');

    return new AddonRegistry(project).components;
  },

  filterComponents(tree) {
    if (this.skipTreeshaking) {
      return tree;
    }

    return new Funnel(tree, {
      exclude: [this.excludeComponent],
    });
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
