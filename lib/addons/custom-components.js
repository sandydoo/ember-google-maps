'use strict';

const globalStorePath = '__ember_google_maps_custom_components__';

function getGlobalStore() {
  if (!global[globalStorePath]) {
    global[globalStorePath] = new WeakMap();
  }

  return global[globalStorePath];
}

class CustomComponents {
  static for(appInstance) {
    let globalStore = getGlobalStore();

    if (!globalStore.has(appInstance)) {
      globalStore.set(appInstance, new Map());
    }

    let customComponents = globalStore.get(appInstance);

    return new CustomComponents(appInstance.name, customComponents);
  }

  constructor(hostAppName, customComponents) {
    this.hostAppName = hostAppName;
    this.customComponents = customComponents;
  }

  useMergeTactic(tactic) {
    if (tactic && typeof tactic !== 'function') {
      throw new Error('mergeCustomComponents has to be a function');
    }

    this.mergeTactic = tactic;

    return this;
  }

  add(fromAddon, components) {
    this.customComponents.set(fromAddon, components);
    return this;
  }

  merge() {
    if (this.mergeTactic) {
      // TODO Verify that the output is correct?
      return this.mergeTactic(this.customComponents);
    }

    let mergedCustomComponents = {};
    for (let [addonName, customComponents] of this.customComponents) {
      // Skip the host app and add it in the end
      if (addonName === this.hostAppName) continue;
      Object.assign(mergedCustomComponents, customComponents);
    }

    // Give preference to the host app's custom components.
    let hostCustomComponents = this.customComponents.get(this.hostAppName);
    return Object.assign(mergedCustomComponents, hostCustomComponents);
  }
}

module.exports = CustomComponents;
