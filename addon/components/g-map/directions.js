import MapComponent from './map-component';
import layout from '../../templates/components/g-map/directions';
import { inject as service } from '@ember/service';
import { get, setProperties } from '@ember/object';
import { reads } from '@ember/object/computed';
import { A } from '@ember/array';
import { tryInvoke } from '@ember/utils';
import { Promise } from 'rsvp';

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

  route() {
    return this._route().then((directions) => {
      setProperties(this, {
        directions,
        mapComponent: directions
      });

      tryInvoke(this, 'onDirectionsChanged', [this.publicAPI]);
    });
  },

  _route() {
    return get(this, 'directionsService').then((directionsService) => {
      let options = get(this, '_options');
      delete options.map;

      return new Promise((resolve, reject) => {
        directionsService.route(options, (response, status) => {
          if (status === 'OK') {
            resolve(response);
          } else {
            reject(status);
          }
        });
      });
    });
  },

  _registerWaypoint(waypoint) {
    get(this, 'waypoints').pushObject(waypoint);
  },

  _unregisterWaypoint(waypoint) {
    get(this, 'waypoints').removeObject(waypoint);
  }
});
