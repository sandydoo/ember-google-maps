import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map/map-component', function(hooks) {
  setupRenderingTest(hooks);

  test('it registers with the parent map when created', async function(assert) {
    assert.expect(1);

    this._internalAPI = {
      _registerComponent: (type) => assert.equal(type, 'test', 'it registers'),
      _unregisterComponent: () => {}
    };

    await render(hbs`{{g-map/map-component map _internalAPI _type="test"}}`);
  });

  test('it unregisters with the parent map when destroyed', async function(assert) {
    assert.expect(1);

    this._internalAPI = {
      _registerComponent: () => {},
      _unregisterComponent: (type) => assert.equal(type, 'test', 'it unregisters'),
    };

    await render(hbs`{{g-map/map-component map _internalAPI _type="test"}}`);
  });
});
