'use strict';

const path = require('path');

module.exports = function (env) {
  let isCI = Boolean(process.env.CI);

  return {
    enabled: !isCI, // disable for CI
    clientAllowedKeys: ['GOOGLE_MAPS_API_KEY'],
    failOnMissingKey: false,
    path: path.join(path.dirname(__dirname), `.env.${env}`),
  };
};
