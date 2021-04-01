import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | g map/canvas', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a default canvas div', async function (assert) {
    await render(hbs`
      <GMap @lat={{lat}} @lng={{lng}} />
    `);

    assert.ok(find('.ember-google-map'), 'canvas rendered');
  });

  test('it passed class names to the default canvas', async function (assert) {
    await render(hbs`
      {{g-map lat=lat lng=lng classNames="extra-class-names"}}
    `);

    assert.ok(
      find('.extra-class-names'),
      'canvas rendered with extra class names'
    );
  });

  test('it renders a custom canvas div', async function (assert) {
    await render(hbs`
      <GMap @lat={{lat}} @lng={{lng}} as |g|>
        <g.canvas @class="custom-class" />
      </GMap>
    `);

    assert.ok(find('.custom-class'), 'custom canvas rendered');
  });

  test('octane: it renders a custom canvas div with splatted classes', async function (assert) {
    await render(hbs`
      <GMap @lat={{lat}} @lng={{lng}} as |g|>
        <g.canvas class="custom-class" />
      </GMap>
    `);

    assert.ok(find('.custom-class'), 'custom angle-bracket canvas rendered');
  });
});
