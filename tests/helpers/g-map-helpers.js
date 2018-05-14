import { run } from '@ember/runloop';

/**
 * Wrap the Google Maps trigger method in an Ember runloop.
 */
export function trigger(component, eventName, ...options) {
  run(() => {
    google.maps.event.trigger(component, eventName, ...options);
  });
}

export function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setProperties } from '@ember/object';
import { registerWaiter } from '@ember/test';
import GMapComponent from 'ember-google-maps/components/g-map';
import { london } from './locations';

/**
 * Set up for map component testing:
 *
 * * Set default `lat` and `lng`
 * * Set `map` to a promise-aware ObjectProxy that resolves when all map
 *   components have loaded. This is accomplished by hooking into the
 *   `onComponentsLoad` hook.
 *
 */
export function moduleForMap(name, tests) {
  module(name, function(hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function() {
      setProperties(this, london);

      let testContext = this;
      let waiterFulfilled = false;

      this.owner.register('component:g-map', GMapComponent.extend({
        init() {
          this._super(...arguments);

          registerWaiter(() => {
            if (this._componentsInitialized === true) {
              if (!waiterFulfilled) {
                let { id, components, map } = this.publicAPI;
                setProperties(testContext, { id, components, map });
                waiterFulfilled = true;
              }

              return true;
            }
          });
        }
      }));
    });

    tests.apply(this, [hooks]);
  });
}
