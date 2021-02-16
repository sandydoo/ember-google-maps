import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map/map-component', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  hooks.before(function() {
    this._addComponent = () => {};
  });

  test('it registers with the parent map when created', async function(assert) {
    assert.expect(1);

    this._internalAPI = {
      _registerComponent: (type) => assert.equal(type, 'tests', 'it registers'),
      _unregisterComponent: () => {}
    };

    await render(hbs`
      <GMap::MapComponent
        @map={{map}}
        @_internalAPI={{_internalAPI}}
        @_type="test"
        @_addComponent={{_addComponent}} />
    `);
  });

  test('it unregisters with the parent map when destroyed', async function(assert) {
    assert.expect(1);

    this._internalAPI = {
      _registerComponent: () => {},
      _unregisterComponent: (type) => assert.equal(type, 'tests', 'it unregisters'),
    };

    await render(hbs`
      <GMap::MapComponent
        @map={{map}}
        @_internalAPI={{_internalAPI}}
        @_type="test"
        @_addComponent={{_addComponent}} />`
    );
  });
});
