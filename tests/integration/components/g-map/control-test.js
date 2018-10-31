import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map/control', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a custom control', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=12 as |g|}}
        {{#g.control position="TOP_CENTER"}}
          <div id="custom-control"></div>
        {{/g.control}}
      {{/g-map}}
    `);

    let { map, components: { controls } } = this.gMapAPI;

    assert.equal(controls.length, 1);

    let control = await waitFor('#custom-control');
    assert.ok(control, 'control rendered');

    let mapControls = map.controls[google.maps.ControlPosition.TOP_CENTER];
    assert.equal(controls[0].mapComponent, mapControls.getAt(0), 'control rendered in correct position');
  });

  test('it renders a control with a class value', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=12 as |g|}}
        {{#g.control position="TOP_CENTER" class="custom-control-holder"}}
          <div id="custom-control"></div>
        {{/g.control}}
      {{/g-map}}
    `);

    let control = await waitFor('.custom-control-holder');
    assert.ok(control, 'control rendered');
  });
});
