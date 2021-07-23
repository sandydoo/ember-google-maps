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
      // An optional function to let you merge custom components declared by
      // other addons. This shouldn't be necessary in most cases, unless there
      // is a naming conflict.
      mergeCustomComponents(componentsByAddonName) {
        let components = {};

        for (([addonName, customComponents] of componentsByAddonName)) {
          Object.assign(components, customComponents);
        }

        return components;
      }
    },
  });

  return app.toTree();
};
