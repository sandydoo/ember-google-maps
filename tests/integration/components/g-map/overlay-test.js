import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { find, render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { get, set } from '@ember/object';
import { later } from '@ember/runloop';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function coinToss() {
  return Math.random() >= 0.5 ? true : false;
}

function perturbLocations(times) {
  for (let i = 1; i <= times; i++) {
    later(() => {
      set(this, 'locations', this.originalLocations.filter(coinToss));
    }, 50 * i);
  }
}

function generateLocations(google, center) {
  let { lat, lng } = center,
      maps = get(google, 'maps'),
      origin = new maps.LatLng(lat, lng);

  return Array(42).fill().map((_e, i) => {
    let heading = randomInt(1, 360),
        distance = randomInt(100, 5000),
        n = maps.geometry.spherical.computeOffset(origin, distance, heading);
    return { id: i, lat: n.lat(), lng: n.lng() };
  });
}

module('Integration | Component | g map/overlay', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a custom overlay', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=12 as |g|}}
        {{#g.overlay lat=lat lng=lng}}
          <div id="custom-overlay"></div>
        {{/g.overlay}}
      {{/g-map}}
    `);

    let { id, components: { overlays } } = this.gMapAPI;
    let overlay = await waitFor('#custom-overlay');
    let mapDiv = find(`#${id}`);

    assert.equal(overlays.length, 1, 'overlay registered');

    assert.ok(overlay, 'overlay rendered');

    assert.ok(mapDiv.contains(overlay), 'overlay is child of map node');
  });

  test('it survives a performance test without errors', async function(assert) {
    assert.expect(0);

    let center = { lat: this.lat, lng: this.lng },
        googleMapsApi = this.owner.lookup('service:google-maps-api'),
        google = await get(googleMapsApi, 'google');

    this.originalLocations = await generateLocations(google, center);
    this.locations = this.originalLocations;

    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=12 as |g|}}
        {{#each locations as |loc|}}
          {{#g.overlay lat=loc.lat lng=loc.lng}}
            <div>Test</div>
          {{/g.overlay}}
        {{/each}}
      {{/g-map}}
    `);

    await perturbLocations.call(this, 30);
  });
});
