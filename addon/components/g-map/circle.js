import Marker from './marker';
import { get, set } from '@ember/object';
import { reads } from '@ember/object/computed';

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
  _requiredOptions: ['center', 'radius'],

  radius: 500,
  center: reads('position'),

  _addComponent() {
    set(this, 'mapComponent', new google.maps.Circle(get(this, '_options')));
  }
});
