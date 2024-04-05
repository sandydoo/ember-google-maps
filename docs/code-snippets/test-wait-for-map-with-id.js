import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMapTest, waitForMap } from 'ember-google-maps/test-support';

module('Acceptance | map', function (hooks) {
  setupApplicationTest(hooks);
  setupMapTest(hooks);

  test('visiting /map', async function (assert) {
    await visit('/map');

    let { map, components } = await waitForMap('some-unique-id');

    assert.ok(map);
  });
});
