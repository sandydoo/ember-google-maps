import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest, trigger } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { find, render, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g-map/info-window', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  hooks.beforeEach(function() {
    this.onDomReady = () => { this._domReady = true; };
    this.domIsReady = () => this._domReady;
  });

  function getInfoWindow(gMapAPI) {
    let { components: { infoWindows } } = gMapAPI;
    return infoWindows[0].mapComponent;
  }

  function isVisible(infoWindow) {
    return infoWindow.getMap() && infoWindow.getPosition();
  }

  test('it registers an info window', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.infoWindow lat=lat lng=lng isOpen=false content="test"}}
      {{/g-map}}
    `);

    let { components: { infoWindows } } = this.gMapAPI;

    assert.equal(infoWindows.length, 1);

    let infoWindow = infoWindows[0].mapComponent;
    assert.ok(infoWindow);
  });

  test('it opens an info window when isOpen is set to true', async function(assert) {
    this.isOpen = false;

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.infoWindow lat=lat lng=lng isOpen=isOpen content="Opening an info window!" onDomready=(action onDomReady)}}
      {{/g-map}}
    `);

    let infoWindow = getInfoWindow(this.gMapAPI);

    assert.notOk(isVisible(infoWindow));

    this.set('isOpen', true);
    await waitUntil(this.domIsReady);

    assert.ok(isVisible(infoWindow));
  });

  test('it renders an info window with custom html passed using the content attribute', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.infoWindow lat=lat lng=lng isOpen=true
          onDomready=(action onDomReady)
          content="<div id='info-window-test'>Content rendering test!</div>"}}
      {{/g-map}}
    `);

    await waitUntil(this.domIsReady);

    let infoWindow = getInfoWindow(this.gMapAPI);

    assert.ok(find('#info-window-test'));
    assert.ok(isVisible(infoWindow));
  });

  test('it renders an info window with custom html passed as a block', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.infoWindow lat=lat lng=lng isOpen=true onDomready=(action onDomReady)}}
          <div id="info-window-test">Custom HTML block test!</div>
        {{/g.infoWindow}}
      {{/g-map}}
    `);

    await waitUntil(this.domIsReady);

    let infoWindow = getInfoWindow(this.gMapAPI);

    assert.ok(find('#info-window-test'));
    assert.ok(isVisible(infoWindow));
  });

  test('it attaches an info window to a marker', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=6 as |g|}}
        {{#g.marker lat=55 lng=2 as |m|}}
          {{m.infoWindow isOpen=true content="Testing info windows attached to markers" onDomready=(action onDomReady)}}
        {{/g.marker}}
      {{/g-map}}
    `);

    await waitUntil(this.domIsReady);

    let infoWindow = getInfoWindow(this.gMapAPI);

    // Wait until Google Maps updates the position value.
    await waitUntil(() => isVisible(infoWindow));

    assert.deepEqual(infoWindow.getPosition().toJSON(), { lat: 55, lng: 2 });
  });

  test('it closes the info window when isOpen is set to false', async function(assert) {
    this.isOpen = true;

    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=6 as |g|}}
        {{#g.marker lat=55 lng=2 as |m|}}
          {{#m.infoWindow isOpen=isOpen onDomready=(action onDomReady)}}
            <div id="info-window-test">
              An info window attached to a marker!
            </div>
          {{/m.infoWindow}}
        {{/g.marker}}
      {{/g-map}}
    `);

    await waitUntil(this.domIsReady);

    let infoWindow = getInfoWindow(this.gMapAPI);

    assert.ok(find('#info-window-test'));
    assert.ok(isVisible(infoWindow));

    this.set('isOpen', false);

    assert.notOk(find('#info-window-test'));
    assert.notOk(isVisible(infoWindow));
  });

  test('it closes the info window when the close button is clicked', async function(assert) {
    this.isOpen = true;

    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=6 as |g|}}
        {{#g.marker lat=55 lng=2 as |m|}}
          {{m.infoWindow isOpen=isOpen content="<div id='info-window-test'>Testing the close button!</div>" onDomready=(action onDomReady)}}
        {{/g.marker}}
      {{/g-map}}
    `);

    await waitUntil(this.domIsReady);

    let infoWindow = getInfoWindow(this.gMapAPI);

    assert.ok(find('#info-window-test'));
    assert.ok(isVisible(infoWindow));

    trigger(infoWindow, 'closeclick');

    assert.notOk(find('#info-window-test'), 'info window closed');
    assert.notOk(isVisible(infoWindow));
    assert.ok(this.isOpen === false);
  });
});
