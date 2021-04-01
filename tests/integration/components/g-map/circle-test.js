import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map/circle', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a circle', async function (assert) {
    await render(hbs`
      <GMap @lat={{lat}} @lng={{lng}} as |g|>
        <g.circle @lat={{lat}} @lng={{lng}} />
      </GMap>
    `);

    let {
      map,
      components: { circles },
    } = this.gMapAPI;

    assert.equal(circles.length, 1);
    assert.equal(circles[0].mapComponent.map, map);
  });
});
