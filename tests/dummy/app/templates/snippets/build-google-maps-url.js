/* app/services/google-maps-api.js */

import GoogleMapsAPIService from 'ember-google-maps/services/google-maps-api';

export default GoogleMapsAPIService.extend({
  buildGoogleMapsUrl(config) {
    let [language, region] = navigator.language.split('-');

    let src = `//maps.googleapis.com/maps/api/js?`
    let params = [`key=${config.key}`];

    if (language) { params.push(`language=${language}`); }

    if (region) { params.push(`region=${region}`); }

    return src + params.join('&');
  }
});
