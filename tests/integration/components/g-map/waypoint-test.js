import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g-map/waypoint', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it adds a waypoint to the directions', async function(assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';
    this.waypointLocation = 'Leather Lane';

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.directions origin=origin destination=destination travelMode="WALKING" as |d|}}
          {{d.waypoint location=waypointLocation}}
        {{/g.directions}}
      {{/g-map}}
    `);

    let { components: { directions } } = this.gMapAPI;
    let request = directions[0].directions.request;

    assert.equal(request.waypoints.length, 1);
    assert.equal(request.waypoints[0].location.query, this.waypointLocation);
  });

  test('it updates the current directions when added', async function(assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';
    this.waypointLocation = 'Leather Lane';
    this.addWaypoint = true;
    this.directionsChanged = false;
    this.onDirectionsChanged = () => { this.directionsChanged = true; };

    let directionsChanged = () => this.directionsChanged;

    function getWaypoints(directions) {
      return directions[0].directions.request.waypoints;
    }

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.directions
          origin=origin
          destination=destination
          travelMode="WALKING"
          onDirectionsChanged=(action onDirectionsChanged) as |d|}}
          {{#if addWaypoint}}
            {{d.waypoint location=waypointLocation}}
          {{/if}}
        {{/g.directions}}
      {{/g-map}}
    `);

    await waitUntil(directionsChanged, { timeout: 10000 });

    let { components: { directions } } = this.gMapAPI;
    let waypoints = getWaypoints(directions);

    assert.equal(waypoints.length, 1);

    this.directionsChanged = false;
    this.set('addWaypoint', false);

    await waitUntil(directionsChanged, { timeout: 10000 });

    directions = this.gMapAPI.components.directions;
    waypoints = getWaypoints(directions);

    assert.equal(waypoints.length, 0);
  });
});
