import { run } from '@ember/runloop';

/**
 * Wrap the Google Maps trigger method in an Ember runloop.
 */
export function trigger(component, eventName, ...options) {
  run(() => {
    google.maps.event.trigger(component, eventName, ...options);
  });
}

import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import GMapComponent from 'ember-google-maps/components/g-map';
import { london } from './locations';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { defer } from 'rsvp';

const ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

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
      this.setProperties(london);

      const promise = defer();
      this.set('map', ObjectPromiseProxy.create({ promise: promise.promise }));

      this.owner.register('component:g-map', GMapComponent.extend({
        init() {
          this._super(...arguments);
          this.set('onComponentsLoad', (result) => promise.resolve(result));
        }
      }));
    });

    tests.apply(this, [hooks]);
  });
}