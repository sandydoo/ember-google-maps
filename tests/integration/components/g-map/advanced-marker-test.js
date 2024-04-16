import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest, trigger } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { toLatLng } from 'ember-google-maps/utils/helpers';

module('Integration | Component | g map/advanced-marker', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders an advanced-marker', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.advancedMarker @lat={{this.lat}} @lng={{this.lng}} />
      </GMap>
    `);

    let {
      map,
      components: { 'advanced-markers': advancedMarkers },
    } = await this.waitForMap();

    let advancedMarker = advancedMarkers[0].mapComponent;

    assert.strictEqual(advancedMarkers.length, 1);
    assert.deepEqual(advancedMarker.map, map);
  });

  test('it attaches an event to an advanced marker', async function (assert) {
    assert.expect(1);

    this.onClick = () => assert.ok('It binds events to actions');

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.advancedMarker @lat={{this.lat}} @lng={{this.lng}} @onClick={{this.onClick}} />
      </GMap>
    `);

    let {
      components: { 'advanced-markers': advancedMarkers },
    } = await this.waitForMap();

    let advancedMarker = advancedMarkers[0].mapComponent;

    trigger(advancedMarker, 'click');
  });

  test('it sets options on an advanced marker', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.advancedMarker @lat={{this.lat}} @lng={{this.lng}} @gmpDraggable={{true}} />
      </GMap>
    `);

    let {
      components: { 'advanced-markers': advancedMarkers },
    } = await this.waitForMap();

    let advancedMarker = advancedMarkers[0].mapComponent;

    assert.true(advancedMarker.gmpDraggable);
  });

  test('it unregisters an advanced marker on teardown', async function (assert) {
    assert.expect(2);

    this.set('showMarker', true);

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        {{#if this.showMarker}}
          <g.advancedMarker @lat={{this.lat}} @lng={{this.lng}} @gmpDraggable={{true}} />
        {{/if}}
      </GMap>
    `);

    let {
      components: { 'advanced-markers': advancedMarkers },
    } = await this.waitForMap();

    assert.strictEqual(advancedMarkers.length, 1, 'advanced marker registered');

    this.set('showMarker', false);
    await this.waitForMap();

    // This tests makes sure that the markers array is updated.
    assert.strictEqual(advancedMarkers.length, 0, 'marker unregistered');
  });

  test('it updates the advanced marker’s position', async function (assert) {
    this.setProperties({
      markerLat: this.lat,
      markerLng: this.lng,
    });

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.advancedMarker @lat={{this.markerLat}} @lng={{this.markerLng}}/>
      </GMap>
    `);

    await this.waitForMap();

    let newLatLng = google.maps.geometry.spherical.computeOffset(
      toLatLng(this.markerLat, this.markerLng),
      5000,
      0,
    );

    this.setProperties({
      markerLat: newLatLng.lat(),
      markerLng: newLatLng.lng(),
    });

    let { components } = await this.waitForMap();
    let advancedMarker = components['advanced-markers'][0].mapComponent;

    let newPosition = advancedMarker.position;

    let isLatSame = newLatLng.lat() === newPosition.lat;
    let isLngSame = newLatLng.lng() === newPosition.lng;
    let isLatLngSame = isLatSame && isLngSame;

    assert.ok(isLatLngSame, 'advanced marker position updated');
  });
});
