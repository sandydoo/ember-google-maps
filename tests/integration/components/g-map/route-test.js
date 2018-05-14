import { moduleForMap } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { render, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForMap('Integration | Component | g-map/route', function() {
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

    let { components: { routes } } = this;

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

    let { components: { routes } } = this;
    let route = routes[0].mapComponent;

    assert.equal(route.directions.request.origin.query, this.origin);

    this.directionsChanged = false;
    this.set('origin', 'Holborn Station');

    await waitUntil(directionsChanged, { timeout: 10000 });

    routes = this.components.routes;
    route = routes[0].mapComponent;

    assert.equal(route.directions.request.origin.query, this.origin);
  });
});
