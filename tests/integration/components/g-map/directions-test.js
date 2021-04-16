import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  getDirectionsQuery,
  setupMapTest,
} from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import wait from 'dummy/tests/helpers/wait';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g-map/directions', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  // Slow things down to avoid triggering API query limits.
  hooks.afterEach(async function () {
    await wait(1000);
  });

  test('it fetches directions', async function (assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.directions
          @origin={{this.origin}}
          @destination={{this.destination}}
          @travelMode="WALKING" />
      </GMap>
    `);

    let {
      components: { directions },
    } = await this.waitForMap();

    assert.equal(directions.length, 1);

    let { origin, destination } = getDirectionsQuery(directions[0].directions);

    assert.equal(origin, this.origin);
    assert.equal(destination, this.destination);
  });

  test('it updates the directions when one of the attributes changes', async function (assert) {
    assert.expect(4);

    this.set('origin', 'Covent Garden');
    this.set('destination', 'Clerkenwell');

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.directions
          @origin={{this.origin}}
          @destination={{this.destination}}
          @travelMode="WALKING" />
      </GMap>
    `);

    let { components } = await this.waitForMap();

    let directions = components.directions[0];

    let { origin, destination } = getDirectionsQuery(directions.directions);

    assert.equal(origin, this.origin);
    assert.equal(destination, this.destination);

    this.set('origin', 'Holborn Station');

    await this.waitForMap();

    ({ origin, destination } = getDirectionsQuery(directions.directions));

    assert.equal(origin, this.origin);
    assert.equal(destination, this.destination);
  });
});
