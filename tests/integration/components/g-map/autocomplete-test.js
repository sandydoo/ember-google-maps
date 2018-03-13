import { moduleForMap, trigger } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { fillIn, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForMap('Integration | Component | g map/autocomplete', function() {
  test('it renders a pac-input', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.autocomplete}}
          <input id="pac-input">
        {{/g.autocomplete}}
      {{/g-map}}
    `);

    const { publicAPI } = await this.get('map');

    const input = find('input');
    assert.ok(input, 'input rendered');
    assert.equal(input.id, 'pac-input');
    assert.equal(publicAPI.autocompletes.length, 1);
  });

  test('it calls an action on input', async function(assert) {
    assert.expect(1);

    this.set('onInput', (value) => assert.equal(value, 'test'));

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.autocomplete}}
          <input oninput={{action onInput value="target.value"}}>
        {{/g.autocomplete}}
      {{/g-map}}
    `);

    await fillIn('input', 'test');
  });

  test('it returns place results on search', async function(assert) {
    assert.expect(1);

    this.set('onSearch', () => assert.ok(true, 'place'));

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.autocomplete onSearch=(action onSearch)}}
          <input>
        {{/g.autocomplete}}
      {{/g-map}}
    `);

    const { publicAPI } = await this.get('map');
    // Fetch the initialized Autocomplete component and shim the getPlace
    // function.
    const autocomplete = publicAPI.autocompletes[0].mapComponent;
    autocomplete.getPlace = () => { return { geometry: true }; };

    trigger(autocomplete, 'place_changed');
  });
});
