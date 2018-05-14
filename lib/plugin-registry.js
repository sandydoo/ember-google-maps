'use strict';

const path = require('path');
const fs = require('fs');

function isPlugin(addon) {
  return addon.pkg.keywords.indexOf('ember-google-maps-plugin') !== -1;
}

/**
 * Discover and process plugin addons for ember-google-maps that use the keyword
 * `ember-google-maps-plugin` in their `package.json`.
 */
class PluginRegistry {
  constructor(project) {
    this.project = project;
    this._plugins = null;
    this._components = null;
  }

  /**
   * Find and return all components defined by the plugin addons. The names of
   * plugin components should be begin with `g-map-plugins`.
   * @return {Array}
   */
  get components() {
    if (this._components) {
      return this._components;
    }

    let plugins = this.plugins;
    if (!plugins) {
      return [];
    }

    this._components = plugins.reduce((components, addon) => {
      let pathToAddon = path.join('node_modules', addon.name, 'app/components/g-map-plugins');

      if (fs.existsSync(pathToAddon)) {
        let files = fs.readdirSync(pathToAddon);

        files.forEach((file) => {
          if (fs.statSync(`${pathToAddon}/${file}`).isFile()) {
            file = file.slice(0, -3);
            components.push({ key: file, component: `g-map-plugins/${file}` });
          }
        });
      }

      return components;
    }, []);

    return this._components;
  }

  get plugins() {
    if (this._plugins === null) {
      this._plugins = this._discoverPlugins(this.project.addons || []);
    }

    return this._plugins;
  }

  _discoverPlugins(addons) {
    return addons.reduce((plugins, addon) => {
      if (isPlugin(addon)) {
        plugins.push(addon);
      }

      return plugins;
    }, []);
  }
}

module.exports = PluginRegistry;
