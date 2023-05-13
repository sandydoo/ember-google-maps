// You need to run `yarn install` in the template app directory before running
// tests. This will be fixed when ember-google-maps is converted to a v2 addon.
const { PreparedApp, Project } = require('scenario-tester');
const path = require('path');
const fs = require('fs');
const { merge } = require('lodash');
const QUnit = require('qunit');
const { module: Qmodule, test } = QUnit;

// Path to ember-google-maps
const pathToParentProject = path.resolve(__dirname, '..');

// Fetch the API key from either the environment when running in CI, or from the
// parent addon
let googleMapsApiKey =
  process.env.GOOGLE_MAPS_API_KEY ||
  readApiKeyFrom(path.resolve(pathToParentProject, '.env.test'));

async function setupProject() {
  // Create the project from an app template
  let project = Project.fromDir(path.resolve(__dirname, './app-template'), {
    linkDevDeps: true,
  });

  project.linkDevDependency('ember-google-maps', {
    target: pathToParentProject,
  });

  // Add tests and fixture files
  merge(project.files, {
    'ember-cli-build.js': `\
  /* eslint-env node */
  'use strict';

  const EmberApp = require('ember-cli/lib/broccoli/ember-app');

  module.exports = function (defaults) {
    let options = {
      'ember-google-maps': {
        only: ['marker', 'info-window'],
        customComponents: {
          customMarker: 'custom-marker',
        },
      },
    };

    let app = new EmberApp(defaults, options);

    return app.toTree();
  };
  `,
    app: {
      components: {
        'custom-marker.js': `\
  import Marker from 'ember-google-maps/components/g-map/marker';

  export default class CustomMarker extends Marker {
    get name() {
      return 'customMarkers';
    }
  }
  `,
      },
    },
    tests: {
      integration: {
        // Render a custom component and check that it is correctly registered.
        'custom-components-test.js': `\
  import { module, test } from 'qunit';
  import { render } from '@ember/test-helpers';
  import { setupRenderingTest } from 'ember-qunit';
  import { setupMapTest } from 'ember-google-maps/test-support';
  import hbs from 'htmlbars-inline-precompile';

  module('Integration | Custom Components', function (hooks) {
    setupRenderingTest(hooks);
    setupMapTest(hooks);

    test('custom marker is provided by the map', async function (assert) {
      await render(hbs\`
        <GMap @lat="51.507568" @lng="-0.127762" as |g|>
          <g.customMarker @lat="51.507568" @lng="-0.127762" />
        </GMap>
      \`);

      let { components } = await this.waitForMap();

      assert.strictEqual(components.customMarkers.length, 1);
    });
  });
  `,
        'shakedown-test.js': `\
  import { module, test } from 'qunit';
  import { find, render, waitFor } from '@ember/test-helpers';
  import { setupRenderingTest } from 'ember-qunit';
  import hbs from 'htmlbars-inline-precompile';

  module('Integration | Treeshaking', function (hooks) {
    setupRenderingTest(hooks);

    test('shakedown test of map', async function (assert) {
      await render(hbs\`
        <GMap @lat="51.507568" @lng="-0.127762" as |g|>
          <g.marker @lat="51.507568" @lng="-0.127762" as |marker|>
            <marker.infoWindow @isOpen={{true}}>
              <p id="test-complete">Test complete</p>
            </marker.infoWindow>
          </g.marker>
        </GMap>
      \`);

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
      let expectedError =
        /^Ember Google Maps couldn't find a map component called "circle"!$/m;

      let errorMessages = [];
      console.warn = (...messages) => {
        messages.forEach((message) => {
          let messageText = message.text ?? message;
          errorMessages.push(messageText);
          originalConsoleWarn(message);
        });
      };

      await render(hbs\`
        <GMap @lat="51.507568" @lng="-0.127762" as |g|>
          {{!-- Should throw error --}}
          {{g.circle}}
        </GMap>
      \`);

      assert.true(
        errorMessages.some((msg) => expectedError.test(msg)),
        'missing component assertion thrown'
      );

      console.warn = originalConsoleWarn;
    });
  });
  `,
      },
    },
  });

  // Write the project, including fixtures, to disk
  await project.write();

  return project;
}

Qmodule('Built tests', function (hooks) {
  let app;
  hooks.before(async function () {
    let project = await setupProject();
    app = new PreparedApp(project.baseDir);
  });
  test('Treeshaking and custom component tests', async function (assert) {
    // TODO: it would be nice to pipe out stdout, and not just on promise
    // resolution.
    let result = await app.execute('yarn test:ember', {
      env: { GOOGLE_MAPS_API_KEY: googleMapsApiKey },
    });
    assert.strictEqual(result.exitCode, 0, result.output);
  });
});

function readApiKeyFrom(filepath) {
  try {
    let data = fs.readFileSync(filepath, 'utf-8');
    return data.split('=')[1];
  } catch (err) {
    console.error(err);
  }
}
