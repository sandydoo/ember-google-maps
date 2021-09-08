import { module, test } from 'qunit';
import { visit, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

// Import the helper functions from test support
import {
  setupMapTest,
  trigger,
  waitForMap,
} from 'ember-google-maps/test-support';

module('Acceptance | map', function (hooks) {
  setupApplicationTest(hooks);
  // Run the setup hook
  setupMapTest(hooks);

  test('visiting /map', async function (assert) {
    await visit('/map');

    // Get the last map drawn on the page and its components
    let { map, components } = await waitForMap();

    let marker = components.markers[0].mapComponent;
    // Use the `trigger` helper to simulate events on map components
    trigger(marker, 'click');

    let infoWindow = await waitFor('[data-test-info-window]');
    assert.dom(infoWindow).hasText('You clicked me!');

    // Move the map, for example
    map.panBy(100, 0);
    // And so on...
  });
});
