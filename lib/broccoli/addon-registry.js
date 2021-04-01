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
   * @return {Array}
   */
  get components() {
    if (this._components) {
      return this._components;
    }

    let addons = this.addons;
    if (!addons) {
      return [];
    }

    this._components = addons.reduce((components, addon) => {
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
            file = file.slice(0, -3);
            components.push({
              key: camelCase(file),
              component: `g-map-addons/${file}`,
            });
          }
        });
      }

      return components;
    }, []);

    return this._components;
  }

  get addons() {
    if (this._addons === null) {
      this._addons = this._discoverAddons(this.project.addons || []);
    }

    return this._addons;
  }

  _discoverAddons(projectAddons) {
    return projectAddons.reduce((addons, addon) => {
      if (isGMapAddon(addon)) {
        addons.push(addon);
      }

      return addons;
    }, []);
  }
}

module.exports = AddonRegistry;
