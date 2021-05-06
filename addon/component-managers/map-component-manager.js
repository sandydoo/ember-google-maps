import { capabilities } from '@ember/component';
import { setOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { associateDestroyableChild, destroy } from '@ember/destroyable';
import { assert } from '@ember/debug';

import { buildWaiter } from '@ember/test-waiters';
let testWaiter = buildWaiter('ember-google-maps:map-component-waiter');

import { OptionsAndEvents } from 'ember-google-maps/utils/options-and-events';
import { setupEffect } from 'ember-google-maps/effects/tracking';

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
    destroy(component);

    component.teardown(component.mapComponent);
  }

  getContext(component) {
    return component ?? {};
  }

  setupMapComponent(component) {
    assert('Implement new', component.new);

    let token = testWaiter.beginAsync();

    let hasUpdate = typeof component.update === 'function';

    let effect, mapComponent, trackThisInstead;

    if (hasUpdate) {
      effect = setupEffect(() => {
        if (mapComponent === undefined) {
          mapComponent = component.new(component.options, component.events);

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
        mapComponent = component.new(component.options, component.events);

        component.mapComponent = mapComponent;

        testWaiter.endAsync(token);

        return mapComponent;
      });
    }

    // Destroy effects when the component is destroyed.
    associateDestroyableChild(component, effect);

    return mapComponent;
  }
}
