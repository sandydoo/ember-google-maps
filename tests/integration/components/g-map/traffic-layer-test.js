import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map/traffic-layer', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a traffic layer', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.trafficLayer />
      </GMap>
    `);

    let {
      components: { trafficLayers },
    } = await this.waitForMap();

    assert.strictEqual(trafficLayers.length, 1);
    assert.ok(trafficLayers[0].mapComponent.getMap());
  });
});
