import Service from '@ember/service';
import { computed, get } from '@ember/object';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { Promise, reject, resolve } from 'rsvp';
import { getOwner } from '@ember/application';
import { bind } from '@ember/runloop';
import runloopifyGoogleMaps from '../utils/runloopify-google-maps';

let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

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
  google: computed(function() {
    return ObjectPromiseProxy.create({
      promise: this._loadMapsAPI()
    });
  }).readOnly(),

  /**
   * @method directionsService
   * @readOnly
   * @return {Ember.ObjectProxy}
   */
  directionsService: computed(function() {
    return ObjectPromiseProxy.create({
      promise: get(this, 'google').then(() => {
        return new google.maps.DirectionsService();
      })
    });
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

    const google = window.google;
    if (google) { return resolve(google); }

    // Pre-built url set to environment variable.
    const ENV = getOwner(this).resolveRegistration('config:environment');
    const src = ENV['ember-google-maps']['src'];

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
