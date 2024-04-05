import { capabilities } from '@ember/component';
import { setOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import {
  associateDestroyableChild,
  destroy,
  isDestroyed,
  isDestroying,
} from '@ember/destroyable';
import { assert } from '@ember/debug';

import { buildWaiter } from '@ember/test-waiters';
let testWaiter = buildWaiter('ember-google-maps:map-component-waiter');

import { OptionsAndEvents } from 'ember-google-maps/utils/options-and-events';
import { setupEffect } from 'ember-google-maps/effects/tracking';

const MAP_INSTANCES = new Map();
let lastMapId = null;

export function registerMapInstance(id, instance) {
  MAP_INSTANCES.set(id, instance);
  lastMapId = id;
}

export function unregisterMapInstance(id) {
  MAP_INSTANCES.delete(id);
}

export function clearMapInstances() {
  MAP_INSTANCES.clear();
}

export function getMapInstance(id) {
  if (id) {
    return MAP_INSTANCES.get(id);
  }

  return MAP_INSTANCES.get(lastMapId);
}

export class MapComponentManager {
  @service
  googleMapsApi;

  get google() {
    return this.googleMapsApi.google;
  }

  get isFastBoot() {
    return this.fastboot?.isFastBoot ?? false;
  }

  capabilities = capabilities('3.13', {
    asyncLifecycleCallbacks: false,
    destructor: true,
    // The update hook updates every single component in the tree, which is slow
    // as molasses.
    updateHook: false,
    createArgs: true,
    prepareArgs: true,
  });

  constructor(owner) {
    this.owner = owner;
    setOwner(this, owner);

    this.fastboot = owner.lookup('service:fastboot');
  }

  createComponent(Class, args) {
    let optionsTracker = new OptionsAndEvents(args.named);

    let { options, events } = optionsTracker;

    let component = new Class(this.owner, args.named, options, events);

    if (!this.isFastBoot) {
      // TODO: What happens when we fail to load the API?
      this.google.then(() => {
        this.setupMapComponent(component);
      });
    }

    return component;
  }

  destroyComponent(component) {
    if (component.canvas) {
      MAP_INSTANCES.delete(component.canvas.id);
    }

    if (component.mapComponent) {
      component?.teardown(component.mapComponent);
    }

    destroy(component);
  }

  getContext(component) {
    return component ?? {};
  }

  setupMapComponent(component) {
    assert(
      'Each map component needs to have a `setup` method.',
      component.setup,
    );

    let token = testWaiter.beginAsync();

    let hasUpdate = typeof component.update === 'function';

    let effect, mapComponent, trackThisInstead;

    if (hasUpdate) {
      effect = setupEffect(() => {
        if (mapComponent === undefined) {
          mapComponent = component.setup(component.options, component.events);

          if (mapComponent.length) {
            [mapComponent, trackThisInstead] = mapComponent;
          }

          component.mapComponent = mapComponent;
        } else {
          component.update(mapComponent, component.options);
        }

        testWaiter.endAsync(token);

        return trackThisInstead ?? mapComponent;
      });
    } else {
      effect = setupEffect(() => {
        // Teardown the previous map component if it exists
        if (mapComponent) {
          component.teardown(mapComponent);
        }

        mapComponent = component.setup(component.options, component.events);

        component.mapComponent = mapComponent;

        testWaiter.endAsync(token);

        return mapComponent;
      });
    }

    // Destroy effects when the component is destroyed.
    if (!isDestroyed(component) && !isDestroying(component)) {
      associateDestroyableChild(component, effect);
    }

    return mapComponent;
  }
}
