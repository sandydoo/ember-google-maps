import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
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

  // Slow things down to avoid triggering API query limits.
  hooks.afterEach(async function () {
    await wait(1000);
  });

  test('it adds a waypoint to the directions', async function (assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';
    this.waypointLocation = 'Leather Lane';

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.directions
          @origin={{this.origin}}
          @destination={{this.destination}}
          @travelMode="WALKING" as |d|>

          <d.waypoint @location={{this.waypointLocation}} />

        </g.directions>
      </GMap>
    `);

    let {
      components: { directions },
    } = await this.waitForMap();

    let request = directions[0].directions.request;

    assert.equal(request.waypoints.length, 1);
    assert.equal(request.waypoints[0].location.query, this.waypointLocation);
  });

  test('it updates the current directions when added', async function (assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';
    this.waypointLocation = 'Leather Lane';
    this.set('addWaypoint', true);

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.directions
          @origin={{this.origin}}
          @destination={{this.destination}}
          @travelMode="WALKING" as |d|>

          {{#if this.addWaypoint}}
            <d.waypoint @location={{this.waypointLocation}} />
          {{/if}}

        </g.directions>
      </GMap>
    `);

    let {
      components: { directions },
    } = await this.waitForMap();

    let waypoints = getWaypoints(directions);

    assert.equal(waypoints.length, 1);

    this.set('addWaypoint', false);

    await this.waitForMap();

    waypoints = getWaypoints(directions);

    assert.equal(waypoints.length, 0);
  });
});
