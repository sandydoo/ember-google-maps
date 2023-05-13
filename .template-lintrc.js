'use strict';

module.exports = {
  extends: 'recommended',

  rules: {
    // Used in g-map.hbs. This rule is overreacting.
    'simple-unless': 'off',
    // Used in tests
    'no-inline-styles': 'off',
    // Required in g-map test where we test that the canvas is inserted.
    'no-unused-block-params': 'off',
  },

  ignore: ['docs/**'],
};
