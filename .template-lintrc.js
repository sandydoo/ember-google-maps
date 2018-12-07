'use strict';

module.exports = {
  extends: 'recommended',

  // Disable this for now. Investigate what the specific rules
  // are and decide whether to adopt. Seems to demand some
  // really crap styling for block components...
  ignore: [
    'addon/templates/components/**',
    'tests/**',
    'dummy/templates/**'
  ],
};
