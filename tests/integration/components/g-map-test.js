import { moduleForMap } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForMap('Integration | Component | g map', function() {
  test('it renders a map', async function(assert) {
    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12}}
    `);

    assert.ok(this.map, 'map initialized');
  });

  test('it passes options to the map', async function(assert) {
    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12 zoomControl=false}}
    `);

    assert.notOk(this.map.zoomControl, 'zoom control disabled');
  });

  test('it updates the map when attributes are changed', async function(assert) {
    this.zoom = 12;

    await render(hbs`
      {{g-map lat=lat lng=lng zoom=zoom}}
    `);

    assert.equal(this.map.zoom, this.zoom);

    this.set('zoom', 15);

    assert.equal(this.map.zoom, this.zoom);
  });

  test('it binds events to the map', async function(assert) {
    assert.expect(1);

    this.onZoomChanged = ({ eventName }) => {
      assert.equal(eventName, 'zoom_changed', 'zoom changed');
    };

    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12 onZoomChanged=(action onZoomChanged)}}
    `);

    this.map.setZoom(10);
  });
});
