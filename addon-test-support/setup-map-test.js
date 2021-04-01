import { registerWaiter } from '@ember/test';
import GMapComponent from 'ember-google-maps/components/g-map';

/**
 * Register a waiter for map component testing.
 *
 * Once all the components are done initializing, the `g-map` publicAPI will be
 * available in the testing context as `gMapAPI`.
 */
export default function setupMapTest(hooks) {
  hooks.beforeEach(function () {
    let testContext = this;
    let waiterFulfilled = false;

    this.owner.register(
      'component:g-map',
      GMapComponent.extend({
        didInsertElement() {
          this._super(...arguments);

          registerWaiter(() => {
            if (this._componentsInitialized === true) {
              if (!waiterFulfilled) {
                testContext.gMapAPI = this.publicAPI;
                waiterFulfilled = true;
              }
              return true;
            }
          });
        },
      })
    );
  });
}
