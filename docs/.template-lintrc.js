'use strict';

module.exports = {
  extends: 'octane',

  // Deal with the docs app later…
  ignore: ['app/templates/**'],

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
