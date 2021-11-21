import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest, trigger } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { toLatLng } from 'ember-google-maps/utils/helpers';

module('Integration | Component | g map/marker', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a marker', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.marker @lat={{this.lat}} @lng={{this.lng}} />
      </GMap>
    `);

    let {
      map,
      components: { markers },
    } = await this.waitForMap();

    let marker = markers[0].mapComponent;

    assert.strictEqual(markers.length, 1);
    assert.deepEqual(marker.map, map);
  });

  test('it attaches an event to a marker', async function (assert) {
    assert.expect(1);

    this.onClick = () => assert.ok('It binds events to actions');

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.marker @lat={{this.lat}} @lng={{this.lng}} @onClick={{this.onClick}} />
      </GMap>
    `);

    let {
      components: { markers },
    } = await this.waitForMap();

    let marker = markers[0].mapComponent;

    trigger(marker, 'click');
  });

  test('it sets options on a marker', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.marker @lat={{this.lat}} @lng={{this.lng}} @draggable={{true}} />
      </GMap>
    `);

    let {
      components: { markers },
    } = await this.waitForMap();

    let marker = markers[0].mapComponent;

    assert.true(marker.draggable);
  });

  test('it unregisters a marker on teardown', async function (assert) {
    assert.expect(2);

    this.set('showMarker', true);

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        {{#if this.showMarker}}
          <g.marker @lat={{this.lat}} @lng={{this.lng}} @draggable={{true}} />
        {{/if}}
      </GMap>
    `);

    let {
      components: { markers },
    } = await this.waitForMap();

    assert.strictEqual(markers.length, 1, 'marker registered');

    this.set('showMarker', false);
    await this.waitForMap();

    // This tests makes sure that the markers array is updated.
    assert.strictEqual(markers.length, 0, 'marker unregistered');
  });

  test('it updates the marker’s position', async function (assert) {
    this.setProperties({
      markerLat: this.lat,
      markerLng: this.lng,
    });

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.marker @lat={{this.markerLat}} @lng={{this.markerLng}}/>
      </GMap>
    `);

    await this.waitForMap();

    let newLatLng = google.maps.geometry.spherical.computeOffset(
      toLatLng(this.markerLat, this.markerLng),
      500,
      0
    );

    this.setProperties({
      markerLat: newLatLng.lat(),
      markerLng: newLatLng.lng(),
    });

    let { components } = await this.waitForMap();
    let marker = components.markers[0].mapComponent;

    assert.ok(
      newLatLng.equals(marker.getPosition()),
      'marker position updated'
    );
  });
});
