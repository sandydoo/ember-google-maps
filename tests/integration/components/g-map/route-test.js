import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g-map/route', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a route', async function(assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.directions origin=origin destination=destination travelMode="WALKING" as |d|}}
          {{d.route}}
        {{/g.directions}}
      {{/g-map}}
    `);

    let { components: { routes } } = this.gMapAPI;

    assert.equal(routes.length, 1);
  });

  test('it updates a route when the directions change', async function(assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';
    this.directionsChanged = false;
    this.onDirectionsChanged = () => { this.directionsChanged = true; };

    let directionsChanged = () => this.directionsChanged;

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.directions
          origin=origin
          destination=destination
          travelMode="WALKING"
          onDirectionsChanged=(action onDirectionsChanged) as |d|}}
          {{d.route}}
        {{/g.directions}}
      {{/g-map}}
    `);

    await waitUntil(directionsChanged, { timeout: 10000 });

    let { components: { routes } } = this.gMapAPI;
    let route = routes[0].mapComponent;

    assert.equal(route.directions.request.origin.query, this.origin);

    this.directionsChanged = false;
    this.set('origin', 'Holborn Station');

    await waitUntil(directionsChanged, { timeout: 10000 });

    assert.equal(route.directions.request.origin.query, this.origin);
  });
});
