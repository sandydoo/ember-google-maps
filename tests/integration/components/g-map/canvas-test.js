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

  test('it renders a canvas div', async function(assert) {
    this._internalAPI = { _registerCanvas: () => {} };

    await render(hbs`{{g-map/canvas _internalAPI=_internalAPI}}`);

    assert.ok(find('.ember-google-map'), 'canvas rendered');
  });
});
