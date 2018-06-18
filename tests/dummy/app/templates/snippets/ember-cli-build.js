const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'ember-google-maps': {
      only: ['-private-api/addon-factory', 'marker', 'info-window']
      // exclude: ['overlay']
    }
  });

  return app.toTree();
};
