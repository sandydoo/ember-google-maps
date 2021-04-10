import { capabilities } from '@ember/component';
import { setOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { associateDestroyableChild, destroy } from '@ember/destroyable';
import { assert } from '@ember/debug';
import { waitFor } from '@ember/test-waiters';

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

  @waitFor
  setupMapComponent(component) {
    assert('Implement new', component.new);

    let hasUpdate = typeof component.update === 'function';

    let mapComponent;
    let effect;

    if (hasUpdate) {
      effect = setupEffect(() => {
        let options = component.newOptions(component.options);

        if (mapComponent === undefined) {
          console.log('new!', component.toString());

          mapComponent = component.new(options, component.events);
          component.mapComponent = mapComponent;
        } else {
          console.log('update!', component.toString());

          component.update(mapComponent, options);
        }

        return mapComponent;
      });
    } else {
      effect = setupEffect(() => {
        console.log('new without update');

        let options = component.newOptions(component.options);
        mapComponent = component.new(options, component.events);
        component.mapComponent = mapComponent;
      });
    }

    // Destroy effects when the component is destroyed.
    associateDestroyableChild(component, effect);

    // Fix for @waitFor
    return mapComponent ?? {};
  }
}
