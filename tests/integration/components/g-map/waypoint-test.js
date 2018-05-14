import { moduleForMap } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { render, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForMap('Integration | Component | g-map/waypoint', function() {
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

    let { components: { directions } } = this;
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
        {{#g.directions origin=origin destination=destination travelMode="WALKING" onDirectionsChanged=(action onDirectionsChanged) as |d|}}
          {{#if addWaypoint}}
            {{d.waypoint location=waypointLocation}}
          {{/if}}
        {{/g.directions}}
      {{/g-map}}
    `);

    await waitUntil(directionsChanged, { timeout: 10000 });

    let { components: { directions } } = this;
    let waypoints = getWaypoints(directions);

    assert.equal(waypoints.length, 1);

    this.directionsChanged = false;
    this.set('addWaypoint', false);

    await waitUntil(directionsChanged, { timeout: 10000 });

    directions = this.components.directions;
    waypoints = getWaypoints(directions);

    assert.equal(waypoints.length, 0);
  });
});
