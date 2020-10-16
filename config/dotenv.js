/* eslint-env node */
module.exports = function(env) {
  let isCI = Boolean(process.env.CI);

  return {
    enabled: !isCI, // disable for CI
    clientAllowedKeys: ['GOOGLE_MAPS_API_KEY'],
    failOnMissingKey: false,
    path: `./.env.${env}`
  };
};
