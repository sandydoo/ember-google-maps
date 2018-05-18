import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g-map/directions', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it fetches directions', async function(assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.directions origin=origin destination=destination travelMode="WALKING"}}
      {{/g-map}}
    `);

    let { components: { directions } } = this.gMapAPI;

    assert.equal(directions.length, 1);

    let {
      origin: { query: origin },
      destination: { query: destination }
    } = directions[0].directions.request;

    assert.equal(origin, this.origin);
    assert.equal(destination, this.destination);
  });

  test('it updates the directions when one of the attributes changes', async function(assert) {
    this.origin = 'Covent Garden';
    this.destination = 'Clerkenwell';
    this.onDirectionsChanged = () => {};

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.directions origin=origin destination=destination travelMode="WALKING" onDirectionsChanged=(action onDirectionsChanged)}}
      {{/g-map}}
    `);

    let { components: { directions } } = this.gMapAPI;

    this.set('onDirectionsChanged', () => { this.directionsChanged = true; });

    this.set('origin', 'Holborn Station');

    let directionsChanged = () => this.directionsChanged;
    await waitUntil(directionsChanged, { timeout: 10000 });

    let {
      origin: { query: origin },
      destination: { query: destination }
    } = directions[0].directions.request;

    assert.equal(origin, this.origin);
    assert.equal(destination, this.destination);
  });
});
