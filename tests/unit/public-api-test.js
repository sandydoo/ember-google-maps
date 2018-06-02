import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import PublicAPI from 'ember-google-maps/utils/public-api';
import EmberObject from '@ember/object';
import Evented from '@ember/object/evented';

const Component = EmberObject.extend(Evented, {
  prop1: 1,
  prop2: 2,

  _method() {},
  _anotherMethod() {}
});

module('Unit | Utils | public-api', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.instance = Component.create();
  });

  test('it creates an API object', function(assert) {
    let publicAPI = new PublicAPI(this.instance, {});
    assert.ok(publicAPI instanceof PublicAPI);
  });

  test('it defines a getter that maps to the instance property', function(assert) {
    let publicAPI = new PublicAPI(this.instance, { prop: 'prop1' });
    assert.equal(publicAPI.prop, 1);
  });

  test('it creates nested structure if the schema contains an object', function(assert) {
    let publicAPI = new PublicAPI(this.instance, { prop: 'prop1', actions: { method: '_method' } });
    assert.ok(publicAPI.hasOwnProperty('prop'));
    assert.ok(publicAPI.actions.hasOwnProperty('method'));
  });

  test('it reopens an existing API instance and redefines properties and merges objects', function(assert) {
    let publicAPI = new PublicAPI(this.instance, { prop: 'prop2', actions: { method: '_method' } });

    publicAPI.reopen({ actions: { anotherMethod: '_anotherMethod' } });

    assert.equal(publicAPI.prop, 2);
    assert.ok(publicAPI.actions.hasOwnProperty('method'));
    assert.ok(publicAPI.actions.hasOwnProperty('anotherMethod'));
  });
});
