/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    snippetPaths: ['tests/dummy/app/templates/snippets'],
    includeHighlightStyle: false,

    sassOptions: {
      precision: 10,
      onlyIncluded: true,
      includePaths: [
        'tests/dummy/app/styles',
        'node_modules/bootstrap/scss'
      ]
    },

    'ember-composable-helpers': {
      only: ['array', 'join', 'toggle']
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
        'examples/sweet-rentals'
      ]
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
