import MapComponent from './map-component';
import layout from '../../templates/components/g-map/route';
import { get, set } from '@ember/object';
import { reject, resolve } from 'rsvp';

/**
 * A wrapper for the google.maps.DirectionsRenderer class.
 *
 * @class Route
 * @namespace GMap
 * @module ember-google-maps/components/g-map/route
 * @extends GMap.MapComponent
 */
export default MapComponent.extend({
  layout,
  tagName: '',

  _type: 'route',

  _createOptions(options) {
    return {
      ...options,
      directions: get(this, 'directions'),
      map: this.map,
    };
  },

  _addComponent(options) {
    if (!options.directions) {
      return reject();
    }

    return resolve(
      set(this, 'mapComponent', new google.maps.DirectionsRenderer(options))
    );
  }
});
