import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render } from '@ember/test-helpers';
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

  test('it passes options to the map', async function(assert) {
    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12 zoomControl=false}}
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

  test('it binds events to the map', async function(assert) {
    assert.expect(1);

    this.onZoomChanged = ({ eventName }) => {
      assert.equal(eventName, 'zoom_changed', 'zoom changed');
    };

    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12 onZoomChanged=(action onZoomChanged)}}
    `);

    let { map } = this.gMapAPI;

    map.setZoom(10);
  });
});
