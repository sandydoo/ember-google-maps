'use strict';

const path = require('path');
const fs = require('fs');
const camelCase = require('camelcase');

/**
 * Discover and process addons for ember-google-maps that use the keyword
 * `ember-google-maps-addon` in their `package.json`.
 */
class AddonRegistry {
  constructor(project) {
    this.project = project;
    this._components = [];
    this._addons = [];
  }

  /**
   * Find and return all components defined by the addons. The names of
   * addon components should be begin with `g-map-addons`.
   * @return {Object}
   */
  get components() {
    if (this._components.length > 0) {
      return this._components;
    }

    if (this.addons.length === 0) {
      return {};
    }

    let components = {};

    for (let addon of this.addons) {
      let pathToAddon = path.join(
        'node_modules',
        addon.name,
        'app/components/g-map-addons',
      );

      if (addon.project.addonPackages[addon.name]) {
        pathToAddon = path.join(
          addon.project.addonPackages[addon.name].path,
          'app/components/g-map-addons',
        );
      }

      if (fs.existsSync(pathToAddon)) {
        let files = fs.readdirSync(pathToAddon);

        files.forEach((file) => {
          if (fs.statSync(`${pathToAddon}/${file}`).isFile()) {
            let basename = file.slice(0, -3);
            let name = camelCase(basename);

            components[name] = `g-map-addons/${basename}`;
          }
        });
      }
    }

    // Cache
    this._components = components;

    return this._components;
  }

  get addons() {
    if (this._addons.length > 0) {
      return this._addons;
    }

    this._addons = this.discoverAddons(this.project.addons);

    return this._addons;
  }

  discoverAddons(projectAddons = []) {
    return projectAddons.filter(isGMapAddon);
  }
}

function isGMapAddon(addon) {
  let keywords = addon.pkg.keywords || [];
  return keywords.includes('ember-google-maps-addon');
}

module.exports = AddonRegistry;
