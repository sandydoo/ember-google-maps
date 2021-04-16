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

module('Integration | Component | g-map/route', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  // Slow things down to avoid triggering API query limits.
  hooks.afterEach(async function () {
    await wait(1000);
  });

  test('it renders a route', async function (assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.directions
          @origin={{this.origin}}
          @destination={{this.destination}}
          @travelMode="WALKING" as |d|>
          {{d.route}}
        </g.directions>
      </GMap>
    `);

    let {
      components: { routes },
    } = await this.waitForMap();

    assert.equal(routes.length, 1);
  });

  test('it updates a route when the directions change', async function (assert) {
    this.set('origin', 'Covent Garden');
    this.set('destination', 'Clerkenwell');

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.directions
          @origin={{this.origin}}
          @destination={{this.destination}}
          @travelMode="WALKING" as |d|>
          {{d.route}}
        </g.directions>
      </GMap>
    `);

    let {
      components: { routes },
    } = await this.waitForMap();

    let directions = routes[0].mapComponent.directions;
    let { origin } = getDirectionsQuery(directions);

    assert.equal(origin, this.origin);

    this.set('origin', 'Holborn Station');

    await this.waitForMap();

    directions = routes[0].mapComponent.directions;
    ({ origin } = getDirectionsQuery(directions));

    assert.equal(origin, this.origin);
  });
});
