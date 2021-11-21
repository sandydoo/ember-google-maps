import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { find, render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map/canvas', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a default canvas div', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} />
    `);

    assert.ok(find('.ember-google-map'), 'canvas rendered');
  });

  test('it passes attributes to the default canvas', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} id="custom-id" class="extra-class-names" />
    `);

    let canvas = await waitFor('.extra-class-names');

    assert.ok(canvas, 'rendered canvas');

    assert.deepEqual(
      Array.from(canvas.classList),
      ['ember-google-map', 'extra-class-names'],
      'canvas rendered with extra class names'
    );

    assert.strictEqual(
      canvas.id,
      'custom-id',
      'canvas rendered with a special id'
    );
  });

  test('it renders a custom canvas div', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        <g.canvas class="custom-class" />
      </GMap>
    `);

    assert.ok(find('.custom-class'), 'custom canvas rendered');
  });
});
