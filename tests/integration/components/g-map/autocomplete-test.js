import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest, trigger } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { fillIn, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map/autocomplete', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a pac-input', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.autocomplete}}
          <input id="pac-input">
        {{/g.autocomplete}}
      {{/g-map}}
    `);

    let { autocompletes } = this.gMapAPI.components;

    assert.equal(autocompletes.length, 1);

    let input = find('input');

    assert.ok(input, 'input rendered');
    assert.equal(input.id, 'pac-input');
  });

  test('it calls an action on input', async function(assert) {
    assert.expect(1);

    this.onInput = (value) => assert.equal(value, 'test');

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

    this.onSearch = () => assert.ok(true, 'place');

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.autocomplete onSearch=(action onSearch)}}
          <input>
        {{/g.autocomplete}}
      {{/g-map}}
    `);

    let { autocompletes } = this.gMapAPI.components;

    // Fetch the initialized Autocomplete component and shim the getPlace
    // function.
    let autocomplete = autocompletes[0].mapComponent;
    autocomplete.getPlace = () => { return { geometry: true }; };

    trigger(autocomplete, 'place_changed');
  });
});
