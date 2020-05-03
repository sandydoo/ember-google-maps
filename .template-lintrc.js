'use strict';

module.exports = {
  extends: 'octane',

  // Disable this for now. Investigate what the specific rules
  // are and decide whether to adopt. Seems to demand some
  // really crap styling for block components...
  ignore: [
    'addon/templates/components/**',
    'lib/in-repo-pin-addon/**',
    'tests/**',
    'dummy/templates/**'
  ],
};
