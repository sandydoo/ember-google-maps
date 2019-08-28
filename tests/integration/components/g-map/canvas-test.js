import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map/canvas', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a default canvas div', async function(assert) {
    await render(hbs`
      {{g-map lat=lat lng=lng zoom=12}}
    `);

    assert.ok(find('.ember-google-map'), 'canvas rendered');
  });

  test('it renders a custom canvas div', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=12 as |g|}}
        {{g.canvas class="custom-class"}}
      {{/g-map}}
    `);

    assert.ok(find('.custom-class'), 'custom canvas rendered');
  });

  test('it renders a custom canvas div with splatted classes', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=12 as |g|}}
        <g.canvas class="custom-class" />
      {{/g-map}}
    `);

    assert.ok(find('.custom-class'), 'custom angle-bracket canvas rendered');
  });
});
