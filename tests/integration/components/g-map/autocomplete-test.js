import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest, trigger } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map/autocomplete', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders an input and binds the `place_changed` event', async function (assert) {
    assert.expect(3);

    this.onPlaceChanged = () => assert.ok('Did call `place_changed`');

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.autocomplete id="custom-id" @onPlaceChanged={{this.onPlaceChanged}} />
      </GMap>
    `);

    let {
      components: { autocompletes },
    } = await this.waitForMap();

    assert.strictEqual(autocompletes.length, 1);

    let input = find('#custom-id');
    let autocomplete = autocompletes[0].mapComponent;

    assert.ok(input, 'input rendered');

    trigger(autocomplete, 'place_changed');
  });

  test('compat: it renders an input and binds the legacy `onSearch` event', async function (assert) {
    assert.expect(3);

    this.onSearch = () => assert.ok('Did call `onSearch`');

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.autocomplete id="custom-id" @onSearch={{this.onSearch}} />
      </GMap>
    `);

    let {
      components: { autocompletes },
    } = await this.waitForMap();

    assert.strictEqual(autocompletes.length, 1);

    let input = find('#custom-id');
    let autocomplete = autocompletes[0].mapComponent;

    assert.ok(input, 'input rendered');

    trigger(autocomplete, 'place_changed');
  });

  test('it registers a custom input in block form', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.autocomplete as |autocomplete|>
          <input {{g-map/did-insert autocomplete.setup}} />
        </g.autocomplete>
      </GMap>
    `);

    await this.waitForMap();

    assert.ok('Everything seems fine');
  });
});
