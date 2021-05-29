import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Modifier | g-map/did-insert', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    assert.expect(3);

    this.onDidInsert = (element, positional, named) => {
      assert.ok(element instanceof Element, 'passes the element');
      assert.equal(positional.length, 1, 'passes positional args');
      assert.equal(Object.keys(named).length, 1, 'passes named args');
    };

    await render(hbs`
      <div {{g-map/did-insert this.onDidInsert "positonal arg" oneMoreThing="named arg" }}></div>
    `);
  });
});
