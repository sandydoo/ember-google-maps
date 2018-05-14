import { moduleForMap } from 'dummy/tests/helpers/g-map-helpers';
import { test } from 'qunit';
import { find, render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import GMapOverlay from 'ember-google-maps/components/g-map/overlay';

moduleForMap('Integration | Component | g map/overlay', function(hooks) {
  /**
   * This is a hack for ember 2.12, which complains about runloop sideeffects
   * from the add() method in the overlay component. Wrapping the test in `run`
   * wasn't working, so here's a little hack.
   */
  hooks.beforeEach(function() {
    this.owner.register('component:g-map/overlay', GMapOverlay.extend({
      add() {
        run(() => this._super(...arguments));
      }
    }));
  });

  test('it renders a custom overlay', async function(assert) {
    await render(hbs`
      {{#g-map lat=lat lng=lng zoom=12 as |g|}}
        {{#g.overlay lat=lat lng=lng}}
          <div id="custom-overlay"></div>
        {{/g.overlay}}
      {{/g-map}}
    `);

    let { id, components: { overlays } } = this;
    let overlay = await waitFor('#custom-overlay');
    let mapDiv = find(`#${id}`);

    assert.equal(overlays.length, 1, 'overlay registered');

    assert.ok(overlay, 'overlay rendered');

    assert.ok(mapDiv.contains(overlay), 'overlay is child of map node');
  });
});
