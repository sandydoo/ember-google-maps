import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Custom Components', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);

  test('custom marker is provided by the map', async function (assert) {
    await render(hbs`
      <GMap @lat="51.507568" @lng="-0.127762" as |g|>
        <g.customMarker @lat="51.507568" @lng="-0.127762" />
      </GMap>
    `);

    let { components } = await this.waitForMap();

    assert.equal(components.customMarkers.length, 1);
  });
});
