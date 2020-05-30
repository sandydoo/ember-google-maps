/* app/services/google-maps-api.js */

import GoogleMapsAPIService from 'ember-google-maps/services/google-maps-api';
import { inject as service } from '@ember/service';

export default GoogleMapsAPIService.extend({
  /**
   * Assume this is a service with a function `model` that loads the current
   * user.
   */
  currentUser: service(),

  buildGoogleMapsUrl(config) {
    return this.currentUser.model()
      .then(user => {
        return `//maps.googleapis.com/maps/api/js?key=${config.key}&language=${user.preferredLanguage}`;
      })
      .catch(error => {
        return `//maps.googleapis.com/maps/api/js?key=${config.key}`;
      });
  }
});
