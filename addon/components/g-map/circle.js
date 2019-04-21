import Marker from './marker';
import { get, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { resolve } from 'rsvp';


/**
 * Circle marker component.
 *
 * @class Circle
 * @namespace GMap
 * @module ember-google-maps/components/g-map/circle
 * @extends GMap.Marker
 */
export default Marker.extend({
  _type: 'circle',

  radius: 500,
  center: reads('position'),

  _createOptions(options) {
    return {
      ...options,
      map: this.map,
      radius: get(this, 'radius'),
      center: get(this, 'center'),
    };
  },

  _addComponent(options) {
    return resolve(
      set(this, 'mapComponent', new google.maps.Circle(options))
    );
  }
});
