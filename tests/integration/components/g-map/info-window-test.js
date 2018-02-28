import { moduleForMap, trigger, wait } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { find, render, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForMap('Integration | Component | g-map/info-window', function() {
  test('it registers an info window', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.infoWindow lat=lat lng=lng isOpen=false content="test"}}
      {{/g-map}}
    `);

    let { publicAPI } = await this.get('map');

    assert.equal(publicAPI.infoWindows.length, 1);

    const infoWindow = publicAPI.infoWindows[0].mapComponent;
    assert.equal(infoWindow.getContent(), 'test');
  });

  test('it opens an info window when isOpen is set to true', async function(assert) {
    assert.expect(1);

    this.set('isOpen', false);

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.infoWindow lat=lat lng=lng isOpen=isOpen content="test"}}
      {{/g-map}}
    `);

    let { publicAPI } = await this.get('map');
    const infoWindow = publicAPI.infoWindows[0].mapComponent;
    infoWindow.open = () => assert.ok('info window opened');

    this.set('isOpen', true);
  });

   test('it renders an info window with custom html passed using the content attribute', async function(assert) {
    this.set('isOpen', false);
    this.set('onDomReady', () => true);

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.infoWindow lat=lat lng=lng isOpen=isOpen
          onDomready=(action onDomReady)
          content="<div id='info-window-test'></div>"}}
      {{/g-map}}
    `);

    await this.get('map');

    this.set('isOpen', true);

    await waitUntil(this.onDomReady);
    assert.ok(find('#info-window-test'));
  });

  test('it renders an info window with custom html passed as a block', async function(assert) {
    this.set('isOpen', false);
    this.set('onDomReady', () => true);

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.infoWindow lat=lat lng=lng isOpen=isOpen onDomready=(action onDomReady)}}
          <div id="info-window-test"></div>
        {{/g.infoWindow}}
      {{/g-map}}
    `);

    await this.get('map');

    this.set('isOpen', true);

    await waitUntil(this.onDomReady);
    assert.ok(find('#info-window-test'));
  });

  test('it attaches an info window to a marker', async function(assert) {
    this.set('isOpen', false);
    this.set('onDomReady', () => this.set('domIsReady', true));

    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=6 as |g|}}
        {{#g.marker lat=55 lng=2 as |m|}}
          {{m.infoWindow isOpen=isOpen content="marker-test" onDomready=(action onDomReady)}}
        {{/g.marker}}
      {{/g-map}}
    `);

    const { publicAPI} = await this.get('map');

    this.set('isOpen', true);

    const domIsReady = () => this.domIsReady;
    await waitUntil(domIsReady);

    // There is some lag between the infoWindow rendering and updating its
    // position. It's probably not worth investigating, so we just wait a bit.
    await wait(500);

    const infoWindow = publicAPI.infoWindows[0].mapComponent;
    assert.deepEqual(infoWindow.getPosition().toJSON(), { lat: 55, lng: 2 });
  });

  test('it closes the info window when isOpen is set to false', async function(assert) {
    this.set('isOpen', true);
    this.set('onDomReady', () => this.set('domIsReady', true));

    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=6 as |g|}}
        {{#g.marker lat=55 lng=2 as |m|}}
          {{m.infoWindow isOpen=isOpen content="<div id='info-window-test'></div>" onDomready=(action onDomReady)}}
        {{/g.marker}}
      {{/g-map}}
    `);

    await this.get('map');

    const domIsReady = () => this.domIsReady;
    await waitUntil(domIsReady);

    assert.ok(find('#info-window-test'), 'info window open');

    this.set('isOpen', false);

    assert.notOk(find('#info-window-test'), 'info window closed');
  });

  test('it closes the info window when the close button is clicked', async function(assert) {
    this.set('isOpen', true);
    this.set('onDomReady', () => this.set('domIsReady', true));

    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=6 as |g|}}
        {{#g.marker lat=55 lng=2 as |m|}}
          {{m.infoWindow isOpen=isOpen content="<div id='info-window-test'></div>" onDomready=(action onDomReady)}}
        {{/g.marker}}
      {{/g-map}}
    `);

    const { publicAPI} = await this.get('map');
    const infoWindow = publicAPI.infoWindows[0].mapComponent;

    const domIsReady = () => this.domIsReady;
    await waitUntil(domIsReady);

    assert.ok(find('#info-window-test'), 'info window open');

    trigger(infoWindow, 'closeclick');

    assert.notOk(find('#info-window-test'), 'info window closed');
  });
});

