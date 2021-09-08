import { module, test } from 'qunit';
import { visit, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import {
  setupMapTest,
  trigger,
  waitForMap,
} from 'ember-google-maps/test-support';

module('Acceptance | app', function (hooks) {
  setupApplicationTest(hooks);
  setupMapTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');
    let { components } = await waitForMap('main-map');

    let marker = components.markers
      .map((marker) => marker.mapComponent)
      .find((marker) => marker.id === 'main-marker');

    trigger(marker, 'click');

    let infoWindow = await waitFor('[data-test-info-window]');
    assert.dom(infoWindow).hasText('You clicked me!');
  });
});
