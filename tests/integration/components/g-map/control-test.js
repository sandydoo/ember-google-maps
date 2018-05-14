import { moduleForMap } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForMap('Integration | Component | g map/control', function() {
  test('it renders a custom control', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=12 as |g|}}
        {{#g.control position="TOP_CENTER"}}
          <div id="custom-control"></div>
        {{/g.control}}
      {{/g-map}}
    `);

    let { map, components: { controls } } = this;

    assert.equal(controls.length, 1);

    let control = await waitFor('#custom-control');
    assert.ok(control, 'control rendered');

    let mapControls = map.controls[google.maps.ControlPosition.TOP_CENTER];
    assert.equal(controls[0].mapComponent, mapControls.getAt(0), 'control rendered in correct position');
  });
});
