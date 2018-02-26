import { moduleForMap } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { render, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForMap('Integration | Component | g-map/waypoint', function() {
  test('it adds a waypoint to the directions', async function(assert) {
    this.set('origin', 'Covent Garden');
    this.set('destination', 'Clerkenwell');
    this.set('waypointLocation', 'Leather Lane');

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.directions origin=origin destination=destination travelMode="WALKING" as |d|}}
          {{d.waypoint location=waypointLocation}}
        {{/g.directions}}
      {{/g-map}}
    `);

    const { publicAPI } = await this.get('map');

    const request = publicAPI.directions[0].directions.request;

    assert.equal(request.waypoints.length, 1);
    assert.equal(request.waypoints[0].location.query, this.waypointLocation);
  });

  test('it updates the current directions when added', async function(assert) {
    this.set('origin', 'Covent Garden');
    this.set('destination', 'Clerkenwell');
    this.set('waypointLocation', 'Leather Lane');
    this.set('addWaypoint', true);
    this.set('onDirectionsChanged', () => {});

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.directions origin=origin destination=destination travelMode="WALKING" onDirectionsChanged=(action onDirectionsChanged) as |d|}}
          {{#if addWaypoint}}
            {{d.waypoint location=waypointLocation}}
          {{/if}}
        {{/g.directions}}
      {{/g-map}}
    `);

    const { publicAPI } = await this.get('map');

    this.set('onDirectionsChanged', () => this.set('directionsChanged', true));

    this.set('addWaypoint', false);

    const directionsChanged = () => this.get('directionsChanged');
    await waitUntil(directionsChanged, { timeout: 5000 });

    const request = publicAPI.directions[0].directions.request;

    assert.equal(request.waypoints.length, 0);
  });
});

