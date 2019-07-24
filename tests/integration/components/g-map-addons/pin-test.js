import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map addons/pin', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a marker from an in-repo addon', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.pin lat=lat lng=lng}}
      {{/g-map}}
    `);

    let { map, components: { markers } } = this.gMapAPI;
    let marker = markers[0].mapComponent;

    assert.equal(markers.length, 1);
    assert.equal(marker.map, map);
  });
});
