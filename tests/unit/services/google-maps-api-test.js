/* eslint no-console: "off", qunit/no-conditional-assertions: "off" */

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | google-maps-api', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.service = this.owner.lookup('service:google-maps-api');
  });

  test('it loads the Google Maps API', async function(assert) {
    window.google = undefined;

    await this.service._loadMapsAPI();
    assert.ok(google.maps);
  });

  test('it skips loading the Google Maps API if it is already loaded', async function(assert) {
    let multipleAPIsRegex = /Google Maps JavaScript API multiple times on this page/;
    let error = console.error;

    console.error = function(...args) {
      let msg = args[0];
      if (multipleAPIsRegex.test(msg)) {
        assert.ok(false, 'The API loader should not load the API multiple times.');
      }

      if (error) {
        error.apply(console, args);
      }
    };

    await this.service._loadMapsAPI();
    assert.ok(google.maps);

    // Should skip loading the API again.
    await this.service._loadMapsAPI();

    console.error = error;
  });
});
