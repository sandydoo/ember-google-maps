import Service from '@ember/service';
import { computedPromise } from '../utils/helpers';
import { get } from '@ember/object';
import { Promise, reject, resolve } from 'rsvp';
import { getOwner } from '@ember/application';
import { bind } from '@ember/runloop';
import runloopifyGoogleMaps from '../utils/runloopify-google-maps';

/**
 * @class GoogleMapsApi
 * @extends Ember.Service
 * @module ember-google-maps/services/google-maps-api
 * @public
 */
export default Service.extend({
  /**
   * @method google
   * @readOnly
   * @return {Ember.ObjectProxy}
   */
  google: computedPromise(function() {
    return this._getApi();
  }).readOnly(),

  /**
   * @method directionsService
   * @readOnly
   * @return {Ember.ObjectProxy}
   */
  directionsService: computedPromise(function() {
    return get(this, 'google').then(() => new google.maps.DirectionsService());
  }).readOnly(),

  /**
   * By default, this returns the Google Maps URL created at build time. You can
   * use this hook to build the URL at runtime instead.
   *
   * This function returns a promise that resolves with the URL. This allows you
   * to use external data when building the URL. For example, you could fetch
   * the database record for the current user for localisation purposes.
   *
   * @method buildGoogleMapsUrl
   * @public
   * @param  {Object} config The ember-google-maps configuration.
   * @return {Promise<string>} The URL to the Google Maps API.
   */
  buildGoogleMapsUrl(config) {
    return resolve(config['src']);
  },

  /**
   * Get the configuration for ember-google-maps set in environment.js. This
   * should contain your API key and any other options you set.
   *
   * @method _getConfig
   * @private
   * @return {Object}
   */
  _getConfig() {
    return getOwner(this).resolveRegistration('config:environment')['ember-google-maps'];
  },

  /**
   * Return or load the Google Maps API.
   *
   * @method _getApi
   * @private
   * @return {Promise<object>}
   */
  _getApi() {
    if (typeof document === 'undefined') { return reject(); }

    let google = window.google;
    if (google && google.maps) { return resolve(google); }

    let config = this._getConfig();

    return this.buildGoogleMapsUrl(config)
      .then(this._loadAndInitApi);
  },

  _loadAndInitApi(src) {
    return new Promise((resolve, reject) => {
      window.initGoogleMap = bind(() => {
        runloopifyGoogleMaps();
        resolve(window.google);
      });

      let s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.onerror = (error) => reject(error);
      // Insert into DOM to avoid CORS problems
      document.body.appendChild(s);

      // Load map
      s.src = `${src}&callback=initGoogleMap`;
    });
  }
});
