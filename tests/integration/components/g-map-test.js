import { moduleForMap } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForMap('Integration | Component | g map', function() {
  test('it renders a map', async function(assert) {
    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12}}
    `);

    const { map } = await this.get('map');
    assert.ok(map, 'map initialized');
  });

  test('it passes options to the map', async function(assert) {
    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12 zoomControl=false}}
    `);

    const { map } = await this.get('map');
    assert.notOk(map.zoomControl, 'zoom control disabled');
  });

  test('it binds events to the map', async function(assert) {
    assert.expect(1);

    this.set('onZoomChanged', ({ eventName }) => {
      assert.equal(eventName, 'zoom_changed', 'zoom changed');
    });

    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12 onZoomChanged=(action onZoomChanged)}}
    `);

    const { map } = await this.get('map');

    map.setZoom(10);
  });
});
