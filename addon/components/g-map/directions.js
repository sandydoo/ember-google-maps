import MapComponent from './map-component';
import layout from '../../templates/components/g-map/directions';
import { inject as service } from '@ember/service';
import { get, setProperties } from '@ember/object';
import { reads } from '@ember/object/computed';
import { A } from '@ember/array';
import { tryInvoke } from '@ember/utils';
import { Promise } from 'rsvp';
import { schedule, scheduleOnce } from '@ember/runloop';
import { task, timeout } from 'ember-concurrency';

/**
 * A wrapper for the google.maps.directionsService API.
 *
 * @class Directions
 * @namespace GMap
 * @module ember-google-maps/components/g-map/directions
 * @extends GMap.MapComponent
 */
export default MapComponent.extend({
  googleMapsApi: service(),

  layout,

  _type: 'directions',
  _pluralType: 'directions',
  _ignoredAttrs: ['onDirectionsChanged'],
  _requiredOptions: ['origin', 'destination', 'travelMode', 'waypoints'],
  _watchedOptions: ['waypoints.[]'],

  directionsService: reads('googleMapsApi.directionsService'),

  init() {
    this._super(...arguments);
    this.waypoints = A();

    this.publicAPI.reopen({
      directions: 'directions',
      waypoints: 'waypoints',
      actions: {
        route: 'route'
      }
    });
  },

  _addComponent() {
    return this.route();
  },

  _updateComponent() {
    return this.route();
  },

  /**
   * Fetch routing information from DirectionsService.
   *
   * This should be run after rendering to avoid triggering the request several
   * times on initial render if there are several waypoints.
   *
   * @method route
   * @public
   */
  route() {
    scheduleOnce('afterRender', get(this, '_route'), 'perform');
  },

  _route: task(function *() {
    yield timeout(300);

    let options = get(this, '_options');
    delete options.map;

    let directions = yield get(this, 'fetchDirections').perform(options);

    setProperties(this, {
      directions,
      mapComponent: directions
    });

    schedule('afterRender', () => tryInvoke(this, 'onDirectionsChanged', [this.publicAPI]));
  }).restartable(),

  fetchDirections: task(function *(options) {
    let directionsService = yield get(this, 'directionsService');

    let request = new Promise((resolve, reject) => {
      directionsService.route(options, (response, status) => {
        if (status === 'OK') {
          resolve(response);
        } else {
          reject(status);
        }
      });
    });

    let directions = yield request;

    return directions;
  }),

  _registerWaypoint(waypoint) {
    get(this, 'waypoints').pushObject(waypoint);
  },

  _unregisterWaypoint(waypoint) {
    get(this, 'waypoints').removeObject(waypoint);
  }
});
