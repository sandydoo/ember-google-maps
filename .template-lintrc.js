'use strict';

module.exports = {
  extends: 'octane',

  rules: {
    // Used in g-map.hbs. This rule is overreacting.
    'simple-unless': 'off',
  },

  // Deal with the docs app later…
  ignore: ['tests/dummy/app/templates/**'],

  overrides: [
    {
      files: ['**/code-snippets/**'],
      rules: {
        'no-log': 'off',
        'no-inline-styles': 'off',
        'no-implicit-this': { allow: ['location.lat', 'location.lng'] },
      },
    },
  ],
};
