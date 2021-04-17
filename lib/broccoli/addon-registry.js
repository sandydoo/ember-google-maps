'use strict';

const path = require('path');
const fs = require('fs');
const camelCase = require('camelcase');

function isGMapAddon(addon) {
  return addon.pkg.keywords.indexOf('ember-google-maps-addon') !== -1;
}

/**
 * Discover and process addons for ember-google-maps that use the keyword
 * `ember-google-maps-addon` in their `package.json`.
 */
class AddonRegistry {
  constructor(project) {
    this.project = project;
    this._addons = null;
    this._components = null;
  }

  /**
   * Find and return all components defined by the addons. The names of
   * addon components should be begin with `g-map-addons`.
   * @return {Object}
   */
  get components() {
    if (this._components) {
      return this._components;
    }

    if (!this.addons) {
      return {};
    }

    let components = {};

    for (let addon of this.addons) {
      let pathToAddon = path.join(
        'node_modules',
        addon.name,
        'app/components/g-map-addons'
      );

      if (addon.project.addonPackages[addon.name]) {
        pathToAddon = path.join(
          addon.project.addonPackages[addon.name].path,
          'app/components/g-map-addons'
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
    if (this._addons === null) {
      this._addons = this._discoverAddons(this.project.addons ?? []);
    }

    return this._addons;
  }

  _discoverAddons(projectAddons) {
    let addons = [];

    for (let addon of projectAddons) {
      if (isGMapAddon(addon)) {
        addons.push(addon);
      }
    }

    return addons;
  }
}

module.exports = AddonRegistry;
