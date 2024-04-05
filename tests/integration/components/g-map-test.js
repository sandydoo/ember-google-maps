import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest, trigger } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { toLatLng } from 'ember-google-maps/utils/helpers';

module('Integration | Component | g map', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders without any coordinates or options', async function (assert) {
    // Google Maps considers all options optional, so this should just render a
    // gray square and not throw any errors.
    await render(hbs`
      <GMap />
    `);

    let api = await this.waitForMap();

    assert.ok(api.map);
  });

  test('it renders a map', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} @zoom={{12}} />
    `);

    let { map } = await this.waitForMap();

    assert.ok(map, 'map initialized');
  });

  test('it passes arguments as options to the map', async function (assert) {
    await render(hbs`
      <GMap
        @lat={{this.lat}}
        @lng={{this.lng}}
        @zoom={{12}}
        @zoomControl={{false}} />
    `);

    let { map } = await this.waitForMap();

    assert.notOk(map.zoomControl, 'zoom control disabled');
  });

  test('it accepts an options hash', async function (assert) {
    await render(hbs`
      <GMap
        @lat={{this.lat}}
        @lng={{this.lng}}
        @options={{g-map/hash zoom=12 zoomControl=false}} />
    `);

    let { map } = await this.waitForMap();

    assert.notOk(map.zoomControl, 'zoom control disabled');
  });

  test('it updates the map when arguments are changed', async function (assert) {
    this.setProperties({
      lat: this.lat,
      lng: this.lng,
      zoom: 12,
    });

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} @zoom={{this.zoom}} />
    `);

    let { map } = await this.waitForMap();

    assert.strictEqual(map.zoom, this.zoom);

    this.set('zoom', 15);

    await this.waitForMap();

    assert.strictEqual(map.zoom, this.zoom, 'map zoom updated');

    let newLatLng = google.maps.geometry.spherical.computeOffset(
      toLatLng(this.lat, this.lng),
      500,
      0,
    );

    this.set('lat', newLatLng.lat());
    this.set('lng', newLatLng.lng());

    await this.waitForMap();

    assert.ok(newLatLng.equals(map.getCenter()), 'map center updated');
  });

  test('it extracts events from the arguments and binds them to the map', async function (assert) {
    assert.expect(1);

    this.onZoomChanged = ({ eventName }) => {
      assert.strictEqual(eventName, 'zoom_changed', 'zoom changed event');
    };

    await render(hbs`
      <GMap
        @lat={{this.lat}}
        @lng={{this.lng}}
        @zoom={{12}}
        @onZoomChanged={{this.onZoomChanged}} />
    `);

    let { map } = await this.waitForMap();

    map.setZoom(10);
  });

  test('it supports events that trigger only once', async function (assert) {
    assert.expect(1);

    this.onLoad = ({ eventName }) => {
      assert.strictEqual(eventName, 'idle', 'map loaded and idle');
    };

    await render(hbs`
      <GMap
        @lat={{this.lat}}
        @lng={{this.lng}}
        @zoom={{12}}
        @onceOnIdle={{this.onLoad}} />
    `);

    let { map } = await this.waitForMap();

    map.panBy(250, 250);

    await this.waitForMap();
  });

  test('it accepts both an events hash and individual attribute events', async function (assert) {
    assert.expect(2);

    this.onClick = ({ eventName }) => {
      assert.strictEqual(eventName, 'click', 'click attribute event');
    };

    this.onZoomChanged = ({ eventName }) => {
      assert.strictEqual(
        eventName,
        'zoom_changed',
        'zoom changed event from events hash',
      );
    };

    await render(hbs`
      <GMap
        @lat={{this.lat}}
        @lng={{this.lng}}
        @zoom={{12}}
        @onClick={{this.onClick}}
        @events={{g-map/hash onZoomChanged=this.onZoomChanged}} />
    `);

    let { map } = await this.waitForMap();

    trigger(map, 'click');

    map.setZoom(10);
  });

  test('it passes attributes to the default canvas', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} class="attributes-test" />
    `);

    await this.waitForMap();

    assert.ok(find('.attributes-test'), 'attributes passed to default canvas');
    assert.ok(
      find('.ember-google-map'),
      'default class appended to attributes',
    );
  });

  test('it renders a default canvas in block form', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} class="attributes-test" as |g|>
      </GMap>
    `);

    assert.ok(find('.ember-google-map'), 'default canvas rendered');
  });
});
