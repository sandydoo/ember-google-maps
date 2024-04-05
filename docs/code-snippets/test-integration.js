import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest, waitForMap } from 'ember-google-maps/test-support';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | map', function (hooks) {
  setupRenderingTest(hooks);
  // Run the setup hook
  setupMapTest(hooks);

  test('it works', async function (assert) {
    this.lat = '51';
    this.lng = '0';

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} />
    `);

    let api = await waitForMap();
    // or just `await waitForMap();` if you don’t need the map instance

    assert.ok(api.map);
  });
});
