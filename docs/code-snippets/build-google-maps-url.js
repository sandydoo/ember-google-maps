/* app/services/google-maps-api.js */

import GoogleMapsAPIService from 'ember-google-maps/services/google-maps-api';

export default GoogleMapsAPIService.extend({
  overrideConfig(config) {
    let [language, region] = navigator.language.split('-');

    if (language) { config.language = language; }

    if (region) { config.region = region; }

    return config
  }
});
