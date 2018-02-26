import { moduleForMap } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { render, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForMap('Integration | Component | g-map/route', function() {
  test('it renders a route', async function(assert) {
    this.set('origin', 'Covent Garden');
    this.set('destination', 'Clerkenwell');

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.directions origin=origin destination=destination travelMode="WALKING" as |d|}}
          {{d.route}}
        {{/g.directions}}
      {{/g-map}}
    `);

    const { publicAPI } = await this.get('map');

    assert.equal(publicAPI.routes.length, 1);
  });

  test('it updates a route when the directions change', async function(assert) {
    this.set('origin', 'Covent Garden');
    this.set('destination', 'Clerkenwell');
    this.set('onDirectionsChanged', () => {});

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.directions origin=origin destination=destination travelMode="WALKING" as |d|}}
          {{d.route onDirectionsChanged=(action onDirectionsChanged)}}
        {{/g.directions}}
      {{/g-map}}
    `);

    const { publicAPI } = await this.get('map');

    this.set('onDirectionsChanged', () => this.set('directionsChanged', true));
    this.set('origin', 'Holborn Station');
    const directionsChanged = () => this.get('directionsChanged');
    await waitUntil(directionsChanged, { timeout: 5000 });

    const route = publicAPI.routes[0].mapComponent;
    assert.equal(route.directions.request.origin.query, this.origin);
  });
});
