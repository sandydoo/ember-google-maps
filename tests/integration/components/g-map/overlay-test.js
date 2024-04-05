import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { find, render, waitFor, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { later } from '@ember/runloop';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function coinToss() {
  return Math.random() >= 0.5 ? true : false;
}

async function generateLocations(googlePromise, { lat, lng }) {
  let google = await googlePromise;

  let origin = new google.maps.LatLng(lat, lng);

  return Array(42)
    .fill()
    .map((_e, i) => {
      let heading = randomInt(1, 360),
        distance = randomInt(100, 5000),
        n = google.maps.geometry.spherical.computeOffset(
          origin,
          distance,
          heading,
        );
      return { id: i, lat: n.lat(), lng: n.lng() };
    });
}

module('Integration | Component | g map/overlay', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a custom overlay', async function (assert) {
    assert.expect(4);

    this.onClick = () => assert.ok('can attach events to overlays');

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} @zoom={{12}} as |g|>
        <g.canvas id="map-canvas" />

        <g.overlay id="overlay-container" @lat={{this.lat}} @lng={{this.lng}} @onClick={{this.onClick}}>
          <div id="custom-overlay"></div>
        </g.overlay>
      </GMap>
    `);

    let {
      components: { overlays },
    } = await this.waitForMap();

    let overlay = await waitFor('#custom-overlay');
    let mapDiv = find('#map-canvas');

    assert.strictEqual(overlays.length, 1, 'overlay registered');

    assert.ok(overlay, 'overlay rendered');

    assert.ok(mapDiv.contains(overlay), 'overlay is child of map node');

    await click('#overlay-container');
  });

  test('it survives a performance test without errors', async function (assert) {
    assert.expect(0);

    let googleMapsApi = this.owner.lookup('service:google-maps-api');

    this.originalLocations = await generateLocations(googleMapsApi.google, {
      lat: this.lat,
      lng: this.lng,
    });

    this.perturbLocations = (times) => {
      for (let i = 1; i <= times; i++) {
        later(() => {
          this.set('locations', this.originalLocations.filter(coinToss));
        }, 100 * i);
      }
    };

    this.set('locations', this.originalLocations);

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} zoom={{12}} as |g|>
        {{#each this.locations as |location|}}
          <g.overlay @lat={{location.lat}} @lng={{location.lng}}>
            <div>Test</div>
          </g.overlay>
        {{/each}}
      </GMap>
    `);

    this.perturbLocations(20);

    await this.waitForMap();
  });
});
