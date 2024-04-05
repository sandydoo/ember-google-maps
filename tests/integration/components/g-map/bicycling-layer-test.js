import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map/bicycling-layers', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a bicycling layer', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.bicyclingLayer />
      </GMap>
    `);

    let {
      components: { bicyclingLayers },
    } = await this.waitForMap();

    assert.strictEqual(bicyclingLayers.length, 1);
    assert.ok(bicyclingLayers[0].mapComponent.getMap());
  });
});
