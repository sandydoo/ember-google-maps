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
    return this._loadMapsAPI();
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
   * Return or load the Google Maps API.
   *
   * @method _loadMapsAPI
   * @private
   * @return {RSVP.Promise}
   */
  _loadMapsAPI() {
    if (typeof document === 'undefined') { return reject(); }

    let google = window.google;
    if (google && google.maps) { return resolve(google); }

    // Pre-built url set to environment variable.
    let ENV = getOwner(this).resolveRegistration('config:environment');
    let src = ENV['ember-google-maps']['src'];

    return new Promise((resolve, reject) => {
      window.initGoogleMap = bind(() => {
        runloopifyGoogleMaps();
        resolve(window.google);
      });

      let s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.onerror = (error) => reject(error);
      // Insert into dom (to avoid cors problems)
      document.body.appendChild(s);

      // Load map
      s.src = `${src}&callback=initGoogleMap`;
    });
  }
});
