import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest, trigger } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { find, render, waitFor, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { toLatLng } from 'ember-google-maps/utils/helpers';

function isVisible(infoWindow) {
  return infoWindow.getMap() && infoWindow.getPosition();
}

module('Integration | Component | g-map/info-window', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  hooks.beforeEach(function () {
    this.getFirstInfoWindow = async () => {
      let {
        components: { infoWindows },
      } = await this.waitForMap();

      return infoWindows[0].mapComponent;
    };
  });

  test('it registers an info window', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.infoWindow
          @lat={{this.lat}}
          @lng={{this.lng}}
          @isOpen={{false}}
          @content="test" />
      </GMap>
    `);

    let {
      components: { infoWindows },
    } = await this.waitForMap();

    assert.strictEqual(infoWindows.length, 1);

    let infoWindow = infoWindows[0].mapComponent;
    assert.ok(infoWindow);
  });

  test('it opens an info window when isOpen is set to true', async function (assert) {
    this.set('isOpen', false);

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.infoWindow
          @lat={{this.lat}}
          @lng={{this.lng}}
          @isOpen={{this.isOpen}}
          @content="Opening an info window!" />
      </GMap>
    `);

    let infoWindow = await this.getFirstInfoWindow();

    assert.notOk(isVisible(infoWindow));

    this.set('isOpen', true);

    await this.waitForMap();

    assert.ok(isVisible(infoWindow));
  });

  // TODO: This should throw an error in development. Very unsafe.
  test('it renders an info window with custom html passed using the content attribute', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.infoWindow
          @lat={{this.lat}}
          @lng={{this.lng}}
          @isOpen={{true}}
          @content="<div id='info-window-test'>Content rendering test!</div>" />
      </GMap>
    `);

    let infoWindow = await this.getFirstInfoWindow();

    assert.ok(find('#info-window-test'));
    assert.ok(isVisible(infoWindow), 'info window is visible');
  });

  test('it renders an info window with custom html passed as a block', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.infoWindow
          @lat={{this.lat}}
          @lng={{this.lng}}
          @isOpen={{true}}>
          <div id="info-window-test">Custom HTML block test!</div>
        </g.infoWindow>
      </GMap>
    `);

    let infoWindow = await this.getFirstInfoWindow();

    let infoWindowElement = await waitFor('#info-window-test');

    assert.ok(infoWindowElement, 'rendered info window content');
    assert.ok(isVisible(infoWindow), 'info window is visible');
  });

  test('it attaches an info window to a marker', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} @zoom={{6}} as |g|>
        <g.marker @lat={{55}} @lng={{2}} as |m|>
          <m.infoWindow
            @isOpen={{true}}
            @content="Testing info windows attached to markers" />
        </g.marker>
      </GMap>
    `);

    let infoWindow = await this.getFirstInfoWindow();

    // Wait until Google Maps updates the position value.
    await waitUntil(() => isVisible(infoWindow));

    assert.deepEqual(infoWindow.getPosition().toJSON(), { lat: 55, lng: 2 });
  });

  test('it closes the info window when isOpen is set to false', async function (assert) {
    this.set('isOpen', true);

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} @zoom={{6}} as |g|>
        <g.marker @lat={{55}} @lng={{2}} as |m|>
          <m.infoWindow
            @isOpen={{this.isOpen}}>
            <div id="info-window-test">
              An info window attached to a marker!
            </div>
          </m.infoWindow>
        </g.marker>
      </GMap>
    `);

    let infoWindow = await this.getFirstInfoWindow();

    assert.ok(find('#info-window-test'));
    assert.ok(isVisible(infoWindow));

    this.set('isOpen', false);

    await this.waitForMap();

    assert.notOk(find('#info-window-test'));
    assert.notOk(isVisible(infoWindow));
  });

  // TODO: We should check that the user binds an event to click close, otherwise isOpen will go out of sync.
  test('it closes the info window when the close button is clicked', async function (assert) {
    this.set('isOpen', true);

    this.closeInfoWindow = () => {
      this.set('isOpen', false);
    };

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} @zoom={{6}} as |g|>
        <g.marker @lat={{55}} @lng={{2}} as |m|>
          <m.infoWindow
            @isOpen={{this.isOpen}}
            @onCloseclick={{this.closeInfoWindow}}
            @content="<div id='info-window-test'>Testing the close button!</div>"/>
        </g.marker>
      </GMap>
    `);

    let infoWindow = await this.getFirstInfoWindow();

    assert.ok(find('#info-window-test'));
    assert.ok(isVisible(infoWindow), 'info window is visible');

    trigger(infoWindow, 'closeclick');

    await this.waitForMap();

    assert.notOk(find('#info-window-test'), 'info window is not in DOM');
    assert.notOk(isVisible(infoWindow), 'info window is not visible');
    assert.false(this.isOpen, 'isOpen is set to false');
  });

  test('it updates the infoWindow’s position', async function (assert) {
    this.setProperties({
      infoWindowLat: this.lat,
      infoWindowLng: this.lng,
    });

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} @zoom={{6}} as |g|>
        <g.infoWindow
          @lat={{this.infoWindowLat}}
          @lng={{this.infoWindowLng}}
          @isOpen={{true}}
          @content="test" />
      </GMap>
    `);

    let infoWindow = await this.getFirstInfoWindow();

    let newLatLng = google.maps.geometry.spherical.computeOffset(
      toLatLng(this.infoWindowLat, this.infoWindowLng),
      500,
      0
    );

    this.setProperties({
      infoWindowLat: newLatLng.lat(),
      infoWindowLng: newLatLng.lng(),
    });

    await this.waitForMap();

    assert.ok(
      newLatLng.equals(infoWindow.getPosition()),
      'info window position updated'
    );
  });
});
