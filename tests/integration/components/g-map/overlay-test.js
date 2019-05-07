import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { find, render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map/overlay', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a custom overlay', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=12 as |g|}}
        {{#g.overlay lat=lat lng=lng}}
          <div id="custom-overlay"></div>
        {{/g.overlay}}
      {{/g-map}}
    `);

    let { id, components: { overlays } } = this.gMapAPI;
    let overlay = await waitFor('#custom-overlay');
    let mapDiv = find(`#${id}`);

    assert.equal(overlays.length, 1, 'overlay registered');

    assert.ok(overlay, 'overlay rendered');

    assert.ok(mapDiv.contains(overlay), 'overlay is child of map node');
  });
});
