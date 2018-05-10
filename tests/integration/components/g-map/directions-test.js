import { moduleForMap } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { render, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForMap('Integration | Component | g-map/directions', function() {
  test('it fetches directions', async function(assert) {
    this.set('origin', 'Covent Garden');
    this.set('destination', 'Clerkenwell');

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.directions origin=origin destination=destination travelMode="WALKING"}}
      {{/g-map}}
    `);

    let { components } = await this.get('map');

    assert.equal(components.directions.length, 1);
    let request = components.directions[0].directions.request;
    let { origin: { query: origin }, destination: { query: destination } } = request;
    assert.equal(origin, this.origin);
    assert.equal(destination, this.destination);
  });

  test('it updates the directions when one of the attributes changes', async function(assert) {
    this.set('origin', 'Covent Garden');
    this.set('destination', 'Clerkenwell');
    this.set('onDirectionsChanged', () => {});

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.directions origin=origin destination=destination travelMode="WALKING" onDirectionsChanged=(action onDirectionsChanged)}}
      {{/g-map}}
    `);

    let { components } = await this.get('map');

    this.set('onDirectionsChanged', () => this.set('directionsChanged', true));

    this.set('origin', 'Holborn Station');

    let directionsChanged = () => this.get('directionsChanged');
    await waitUntil(directionsChanged, { timeout: 10000 });

    let request = components.directions[0].directions.request;
    let { origin: { query: origin }, destination: { query: destination } } = request;
    assert.equal(origin, this.origin);
    assert.equal(destination, this.destination);
  });
});
