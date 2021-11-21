'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    snippetPaths: ['code-snippets'],

    babel: {
      plugins: ['@babel/plugin-proposal-optional-chaining'],
    },

    'ember-cli-babel': {
      disablePresetEnv: false,
      includePolyfill: false,
    },

    sassOptions: {
      precision: 10,
      onlyIncluded: true,
      includePaths: ['app/styles', 'node_modules/bootstrap/scss'],
    },

    minifyCSS: {
      options: {
        // Don't break Bootstrap with css mangling.
        // Remove for clean-css 4.0
        advanced: false,
      },
    },

    'ember-composable-helpers': {
      only: ['array', 'join', 'toggle'],
    },

    prember: {
      baseRoot: 'https://ember-google-maps.sandydoo.me',
      // TODO automate this bit
      urls: [
        '/',
        '/docs',
        '/docs/getting-started',
        '/docs/map',
        '/docs/events',
        '/docs/components',
        '/docs/canvas',
        '/docs/markers',
        '/docs/circles',
        '/docs/polylines',
        '/docs/info-windows',
        '/docs/controls',
        '/docs/directions',
        '/docs/overlays',
        '/docs/complex-ui',
        '/docs/testing',
        '/docs/clustering',
        '/docs/advanced',
        '/examples/sweet-rentals',
      ],
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  const { Webpack } = require('@embroider/webpack');
  const compiledApp = require('@embroider/compat').compatBuild(app, Webpack);

  return require('prember').prerender(app, compiledApp);
};
