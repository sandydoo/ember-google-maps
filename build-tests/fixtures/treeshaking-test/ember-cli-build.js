/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let options = {
    'ember-google-maps': {
      only: ['marker', 'info-window']
    }
  };

  let app = new EmberApp(defaults, options);

  return app.toTree();
};
