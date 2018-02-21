import { moduleForMap } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForMap('Integration | Component | g map/canvas', function() {
  test('it renders a canvas div', async function(assert) {
    this.set('_internalAPI', { _registerCanvas: () => {} });

    await render(hbs`{{g-map/canvas _internalAPI=_internalAPI}}`);

    assert.ok(find('.ember-google-map'), 'canvas rendered');
  });
});
