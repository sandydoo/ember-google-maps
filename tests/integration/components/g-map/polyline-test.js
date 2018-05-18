import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { setupLocations } from 'dummy/tests/helpers/locations';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { A } from '@ember/array';

module('Integration | Component | g map/polyline', function(hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);
  setupLocations(hooks);

  test('it updates a polylines when the path attribute changes', async function(assert) {
    this.path = A([
      { lat: 51.56742722687343, lng: -0.25783538818359375 },
      { lat: 51.51917163898047, lng: -0.23586273193359375 },
      { lat: 51.46680134633284, lng: -0.09922027587890625 },
      { lat: 51.476892649684764, lng: -0.0006866455078125 }
    ]);

    await render(hbs`
      {{#g-map lat=lat lng=lng as |g|}}
        {{g.polyline path=path}}
      {{/g-map}}
    `);

    let { components: { polylines } } = this.gMapAPI;
    let polyline = polylines[0].mapComponent;

    assert.ok(polyline, 'polyline exists');

    let newCoords = { lat: 51.500154286474746, lng: 0.05218505859375 };
    this.path.pushObject(newCoords);

    assert.deepEqual(polyline.getPath().getAt(4).toJSON(), newCoords);
  });
});
