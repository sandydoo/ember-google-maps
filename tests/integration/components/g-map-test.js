import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest, trigger } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a map', async function(assert) {
    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12}}
    `);

    let { map } = this.gMapAPI;

    assert.ok(map, 'map initialized');
  });

  test('it passes attributes as options to the map', async function(assert) {
    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12 zoomControl=false}}
    `);

    let { map } = this.gMapAPI;

    assert.notOk(map.zoomControl, 'zoom control disabled');
  });

  test('it accepts an options hash', async function(assert) {
    await render(hbs`
      {{g-map lat=lat lng=lng options=(hash zoom=12 zoomControl=false)}}
    `);

    let { map } = this.gMapAPI;

    assert.notOk(map.zoomControl, 'zoom control disabled');
  });

  test('it updates the map when attributes are changed', async function(assert) {
    this.zoom = 12;

    await render(hbs`
      {{g-map lat=lat lng=lng zoom=zoom}}
    `);

    let { map } = this.gMapAPI;

    assert.equal(map.zoom, this.zoom);

    this.set('zoom', 15);

    assert.equal(map.zoom, this.zoom);
  });

  test('it extracts events from attributes and binds them to the map', async function(assert) {
    assert.expect(1);

    this.onZoomChanged = ({ eventName }) => {
      assert.equal(eventName, 'zoom_changed', 'zoom changed event');
    };

    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12 onZoomChanged=(action onZoomChanged)}}
    `);

    let { map } = this.gMapAPI;

    map.setZoom(10);
  });

  test('it accepts both an events hash and individual attribute events', async function(assert) {
    assert.expect(2);

    this.onClick = ({ eventName }) => {
      assert.equal(eventName, 'click', 'click attribute event');
    };

    this.onZoomChanged = ({ eventName }) => {
      assert.equal(eventName, 'zoom_changed', 'zoom changed event from events hash');
    };

    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12
        onClick=(action onClick)
        events=(hash onZoomChanged=(action onZoomChanged))}}
    `);

    let { map } = this.gMapAPI;

    trigger(map, 'click');

    map.setZoom(10);
  });

  test('it calls the `onComponentsLoad` hook when all the components are ready', async function(assert) {
    assert.expect(2);

    this.onComponentsLoad = () => {
      assert.ok('onComponentsLoad called');
    };

    await render(hbs`
      {{#g-map lat=lat lng=lng
        onComponentsLoad=(action onComponentsLoad) as |g|}}
        {{g.marker lat=lat lng=lng}}
      {{/g-map}}
    `);

    let { components: { markers } } = this.gMapAPI;

    markers[0].isInitialized.promise
      .then(() => assert.ok('Component is actually loaded'));
  });

  /**
   * Octane support tests
   */
  test('it passes attributes to the default canvas', async function(assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} class="attributes-test" />
    `);

    assert.ok(find('.attributes-test'), 'attributes passed to default canvas');
  });
});
