import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Addon System', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it registers the `sampleAddon` component from `ember-google-maps-sample-addon`', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{#g.sampleAddon as |sampleAddon|}}
          {{sampleAddon.marker}}
        {{/g.sampleAddon}}
      {{/g-map}}
    `);

    let { components } = this.gMapAPI;

    assert.equal(components.sampleAddons.length, 1);
    assert.equal(components.markers.length, 1);
  });
});
