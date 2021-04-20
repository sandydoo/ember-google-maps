'use strict';

module.exports = {
  extends: 'octane',

  rules: {
    'no-inline-styles': 'off',
  },

  overrides: [
    {
      files: ['code-snippets/**'],
      rules: {
        'no-log': 'off',
        'no-inline-styles': 'off',
        'no-implicit-this': { allow: ['location.lat', 'location.lng'] },
      },
    },
  ],
};
