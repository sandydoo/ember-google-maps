import Base from './base';
import layout from '../../templates/components/g-map/route';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Base.extend({
  layout,

  tagName: '',

  _type: 'route',

  googleMapsApi: service(),
  directionsService: reads('googleMapsApi.directionsService'),

  _requiredOptions: ['origin', 'destination', 'travelMode', 'waypoints'],

  init() {
    this._super(...arguments);
    this.waypoints = [];
  },

  _addComponent() {
    const map = get(this, 'map');
    set(this, 'mapComponent', new google.maps.DirectionsRenderer({ map }));

    this.route().then((directions) => {
      this.mapComponent.setDirections(directions);
      set(this, 'directions', directions);
      this._didAddComponent();
    });
  },

  route() {
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
    this.waypoints.push(waypoint);
  }
});
