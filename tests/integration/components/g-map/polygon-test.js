import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';

module('Integration | Component | g-map/polygon', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);

  test('it renders a polygon', async function (assert) {
    this.lat = 24.886;
    this.lng = -70.268;

    this.path = A([
      { lat: 25.774, lng: -80.19 },
      { lat: 18.466, lng: -66.118 },
      { lat: 32.321, lng: -64.757 },
      { lat: 25.774, lng: -80.19 },
    ]);

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.polygon @path={{this.path}} />
      </GMap>
    `);

    let {
      components: { polygons },
    } = await this.waitForMap();

    assert.ok(polygons[0].mapComponent, 'the polygon is rendered');
  });
});
