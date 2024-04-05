import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | g-map/rectangle', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it renders a rectangle', async function (assert) {
    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |g|>
        {{#if this.bounds}}
          <g.rectangle @bounds={{this.bounds}} />
        {{/if}}
      </GMap>
    `);

    let { map } = await this.waitForMap();

    this.set('bounds', map.getBounds());

    let api = await this.waitForMap();
    let rectangle = api.components.rectangles[0].mapComponent;

    assert.ok(rectangle, 'rectangle rendered');
    assert.ok(
      rectangle.getBounds().equals(map.getBounds()),
      "rectangle rendered with the map's bounds",
    );
  });
});
