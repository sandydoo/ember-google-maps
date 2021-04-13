import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  setupActionTracking,
  setupMapTest,
} from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import wait from 'dummy/tests/helpers/wait';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

function getWaypoints(directions) {
  return directions[0].directions.request.waypoints;
}

module('Integration | Component | g-map/waypoint', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);
  setupActionTracking(hooks);

  test('it adds a waypoint to the directions', async function (assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';
    this.waypointLocation = 'Leather Lane';

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.directions
          @origin={{this.origin}}
          @destination={{this.destination}}
          @travelMode="WALKING"
          @onDirectionsChanged={{fn this.trackAction "directionsReady"}} as |d|>

          <d.waypoint @location={{this.waypointLocation}} />

        </g.directions>
      </GMap>
    `);

    await this.seenAction('directionsReady', { timeout: 10000 });

    let {
      components: { directions },
    } = await this.waitForMap();

    let request = directions[0].directions.request;

    assert.equal(request.waypoints.length, 1);
    assert.equal(request.waypoints[0].location.query, this.waypointLocation);

    await wait(1000);
  });

  test('it updates the current directions when added', async function (assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';
    this.waypointLocation = 'Leather Lane';
    this.addWaypoint = true;

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.directions
          @origin={{this.origin}}
          @destination={{this.destination}}
          @travelMode="WALKING"
          @onDirectionsChanged={{fn this.trackAction "directionsReady"}} as |d|>

          {{#if this.addWaypoint}}
            <d.waypoint @location={{this.waypointLocation}} />
          {{/if}}

        </g.directions>
      </GMap>
    `);

    await this.seenAction('directionsReady', { timeout: 10000 });

    let {
      components: { directions },
    } = await this.waitForMap();

    let waypoints = getWaypoints(directions);

    assert.equal(waypoints.length, 1);

    await wait(1000);

    this.addWaypoint = false;

    await this.seenAction('directionsReady', { timeout: 10000 });

    waypoints = getWaypoints(directions);

    assert.equal(waypoints.length, 0);

    await wait(1000);
  });
});
