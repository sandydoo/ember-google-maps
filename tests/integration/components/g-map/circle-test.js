import { moduleForMap } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

moduleForMap('Integration | Component | g map/circle', function() {
  test('it renders a circle', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.circle lat=lat lng=lng}}
      {{/g-map}}
    `);

    let { map, components } = await this.get('map');

    assert.equal(components.circles.length, 1);
    assert.equal(components.circles[0].mapComponent.map, map);
  });
});
