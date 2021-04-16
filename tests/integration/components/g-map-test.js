import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest, trigger } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a map', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} @zoom={{12}} />
    `);

    let { map } = await this.waitForMap();

    assert.ok(map, 'map initialized');
  });

  test('it passes attributes as options to the map', async function (assert) {
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
        @options={{hash zoom=12 zoomControl=false}} />
    `);

    let { map } = await this.waitForMap();

    assert.notOk(map.zoomControl, 'zoom control disabled');
  });

  test('it updates the map when attributes are changed', async function (assert) {
    this.set('zoom', 12);

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} @zoom={{this.zoom}} />
    `);

    let { map } = await this.waitForMap();

    assert.equal(map.zoom, this.zoom);

    this.set('zoom', 15);

    await this.waitForMap();

    assert.equal(map.zoom, this.zoom);
  });

  test('it extracts events from attributes and binds them to the map', async function (assert) {
    assert.expect(1);

    this.onZoomChanged = ({ eventName }) => {
      assert.equal(eventName, 'zoom_changed', 'zoom changed event');
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

  test('it accepts both an events hash and individual attribute events', async function (assert) {
    assert.expect(2);

    this.onClick = ({ eventName }) => {
      assert.equal(eventName, 'click', 'click attribute event');
    };

    this.onZoomChanged = ({ eventName }) => {
      assert.equal(
        eventName,
        'zoom_changed',
        'zoom changed event from events hash'
      );
    };

    await render(hbs`
      <GMap
        @lat={{this.lat}}
        @lng={{this.lng}}
        @zoom={{12}}
        @onClick={{this.onClick}}
        @events={{hash onZoomChanged=this.onZoomChanged}} />
    `);

    let { map } = await this.waitForMap();

    trigger(map, 'click');

    map.setZoom(10);
  });

  test('it calls the `onComponentsLoad` hook when all the components are ready', async function (assert) {
    assert.expect(2);

    this.onComponentsLoad = () => {
      assert.ok('onComponentsLoad called');
    };

    await render(hbs`
      <GMap
        @lat={{this.lat}}
        @lng={{this.lng}}
        @onComponentsLoad={{this.onComponentsLoad}} as |g|>

        <g.marker @lat={{this.lat}} @lng={{this.lng}} />

      </GMap>
    `);

    let {
      components: { markers },
    } = await this.waitForMap();

    markers[0].isInitialized.promise.then(() =>
      assert.ok('Component is actually loaded')
    );
  });

  /**
   * Octane support tests
   */
  test('octane: it passes attributes to the default canvas', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} class="attributes-test" />
    `);

    await this.waitForMap();

    assert.ok(find('.attributes-test'), 'attributes passed to default canvas');
    assert.ok(
      find('.ember-google-map'),
      'default class appended to attributes'
    );
  });

  test('octane: it renders a default canvas in block form', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} class="attributes-test" as |g|>
      </GMap>
    `);

    assert.ok(find('.ember-google-map'), 'default canvas rendered');
  });
});
