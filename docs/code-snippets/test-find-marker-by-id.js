import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import {
  setupMapTest,
  trigger,
  waitForMap,
} from 'ember-google-maps/test-support';

module('Acceptance | map', function (hooks) {
  setupApplicationTest(hooks);
  setupMapTest(hooks);

  test('visiting /locations', async function (assert) {
    await visit('/locations');

    let { components } = await waitForMap();

    let marker = components.markers.find(
      (marker) => marker.mapComponent.locationId === '#some-important-location'
    );
    trigger(marker.mapComponent, 'click');

    // Assert something...
  });
});
