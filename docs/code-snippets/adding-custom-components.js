const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    'ember-google-maps': {
      customComponents: {
        // The key is the name you'd like to use in your templates.
        //
        // The value is the name of the component — the same name you'd pass
        // to the component helper.
        customMarker: 'the-name-of-the-component-to-use',
      },
    },
  });

  return app.toTree();
};
