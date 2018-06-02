import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | mergeObjects', function(hooks) {
  setupRenderingTest(hooks);

  test('it merges the objects passed in as arguments', async function(assert) {
    this.firstObject = { a: 1 };

    await render(hbs`{{merge-objects firstObject (hash a=2 b=2)}}`);

    assert.deepEqual(this.firstObject, { a: 2, b: 2 });
  });
});
