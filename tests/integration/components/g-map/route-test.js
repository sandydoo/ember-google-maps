import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  getDirectionsQuery,
  setupActionTracking,
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
  setupActionTracking(hooks);

  test('it renders a route', async function (assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';

    await render(hbs`
      <GMap @lat={{lat}} @lng={{lng}} as |g|>
        <g.directions
          @origin={{origin}}
          @destination={{destination}}
          @travelMode="WALKING" as |d|>
          {{d.route}}
        </g.directions>
      </GMap>
    `);

    let {
      components: { routes },
    } = this.gMapAPI;

    assert.equal(routes.length, 1);

    await wait(1000);
  });

  test('it updates a route when the directions change', async function (assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';

    await render(hbs`
      <GMap @lat={{lat}} @lng={{lng}} as |g|>
        <g.directions
          @origin={{origin}}
          @destination={{destination}}
          @travelMode="WALKING"
          @onDirectionsChanged={{fn this.trackAction "directionsReady"}} as |d|>
          {{d.route}}
        </g.directions>
      </GMap>
    `);

    await this.seenAction('directionsReady', { timeout: 10000 });

    let {
      components: { routes },
    } = this.gMapAPI;

    let directions = routes[0].mapComponent.directions;
    let { origin } = getDirectionsQuery(directions);

    assert.equal(origin, this.origin);

    await wait(1000);

    this.set('origin', 'Holborn Station');

    await this.seenAction('directionsReady', { timeout: 10000 });

    directions = routes[0].mapComponent.directions;
    ({ origin } = getDirectionsQuery(directions));

    assert.equal(origin, this.origin);

    await wait(1000);
  });
});
