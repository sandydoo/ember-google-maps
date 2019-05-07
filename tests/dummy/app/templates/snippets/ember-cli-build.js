const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'ember-google-maps': {
      only: ['marker', 'info-window']
      // except: ['overlay']
    }
  });

  return app.toTree();
};