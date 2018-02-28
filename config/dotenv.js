/* eslint-env node */
module.exports = function(env) {
  return {
    clientAllowedKeys: ['GOOGLE_MAPS_API_KEY'],
    failOnMissingKey: true,
    path: `./.env.${env}`
  };
};