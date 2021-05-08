import { module, test } from 'qunit';
import { find, render, waitFor } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Treeshaking', function (hooks) {
  setupRenderingTest(hooks);

  test('shakedown test of map', async function (assert) {
    await render(hbs`
      <GMap @lat="51.507568" @lng="-0.127762" as |g|>
        <g.marker @lat="51.507568" @lng="-0.127762" as |marker|>
          <marker.infoWindow @isOpen={{true}}>
            <p id="test-complete">Test complete</p>
          </marker.infoWindow>
        </g.marker>
      </GMap>
    `);

    let map = await find('.ember-google-map');
    assert.ok(map, 'map rendered');

    let infoWindow = await waitFor('#test-complete', {
      timeout: 6000,
      count: 1,
    });
    assert.ok(infoWindow, 'info window rendered');
  });

  test('missing component test', async function (assert) {
    assert.expect(1);

    let originalConsoleWarn = console.warn;

    let expectedError = /^Ember Google Maps couldn't find a map component called "circle"!$/m;

    console.warn = (...messages) => {
      messages.forEach((message) => {
        let messageText = message.text ?? message;
        if (expectedError.test(messageText)) {
          assert.ok('missing component assertion thrown');
        }

        originalConsoleWarn(message);
      });
    };

    await render(hbs`
      <GMap @lat="51.507568" @lng="-0.127762" as |g|>
        {{!-- Should throw error --}}
        {{g.circle}}
      </GMap>
    `);

    console.warn = originalConsoleWarn;
  });
});
