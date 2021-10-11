import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { toLatLng } from 'ember-google-maps/utils/helpers';

module('Integration | Component | g map/circle', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a circle', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.circle @lat={{this.lat}} @lng={{this.lng}} />
      </GMap>
    `);

    let {
      components: { circles },
    } = await this.waitForMap();

    assert.equal(circles.length, 1);
    assert.ok(circles[0].mapComponent.getMap());
  });

  test('it updates the circle’s center', async function (assert) {
    this.setProperties({
      circleLat: this.lat,
      circleLng: this.lng,
    });

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.circle @lat={{this.circleLat}} @lng={{this.circleLng}} />
      </GMap>
    `);

    let { components } = await this.waitForMap();
    let circle = components.circles[0].mapComponent;

    let newLatLng = google.maps.geometry.spherical.computeOffset(
      toLatLng(this.circleLat, this.circleLng),
      500,
      0
    );

    this.setProperties({
      circleLat: newLatLng.lat(),
      circleLng: newLatLng.lng(),
    });

    await this.waitForMap();

    assert.ok(newLatLng.equals(circle.getCenter()), 'circle center updated');
  });
});
