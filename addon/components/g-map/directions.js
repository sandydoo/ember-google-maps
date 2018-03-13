import Base from './base';
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
 * @extends GMap.Base
 */
export default Base.extend({
  googleMapsApi: service(),

  layout,

  _type: 'direction',
  _ignoreAttrs: ['onDirectionsChanged'],
  _requiredOptions: ['origin', 'destination', 'travelMode', 'waypoints'],
  _watchedOptions: ['waypoints.[]'],

  directionsService: reads('googleMapsApi.directionsService'),

  init() {
    this._super(...arguments);
    this.waypoints = A();

    this.publicAPI.waypoints = this.waypoints;
    this.publicAPI.actions.route = () => this.route();
  },

  _addComponent() {
    this.route().then(() => this._didAddComponent());
  },

  _updateComponent() {
    this.route();
  },

  route() {
    return this._route().then((directions) => {
      const newDirections = {
        directions,
        mapComponent: directions
      };
      setProperties(this, newDirections);
      setProperties(this.publicAPI, newDirections);
      tryInvoke(this, 'onDirectionsChanged', [this.publicAPI]);
    });
  },

  _route() {
    return get(this, 'directionsService').then((directionsService) => {
      const options = get(this, '_options');
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
