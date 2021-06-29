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

    postcssOptions: {
      compile: {
        enabled: true,
        cacheInclude: [/.*\.(css|scss)$/, /.tailwind\.js$/],
        plugins: [
          {
            module: require('tailwindcss'),
            options: { config: './config/tailwind.config.js' },
          },
        ],
      },
      filter: {
        enabled: true,
        plugins: [
          {
            module: require('autoprefixer'),
          },
        ],
      },
    },

    'ember-composable-helpers': {
      only: ['array', 'join', 'toggle'],
    },

    prember: {
      baseRoot: 'https://ember-google-maps.sandydoo.me',
      urls: [
        '/',
        '/docs',
        '/docs/about',
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
  return require('@embroider/compat').compatBuild(app, Webpack);
};
