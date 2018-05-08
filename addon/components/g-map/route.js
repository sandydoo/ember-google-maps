import MapComponent from './map-component';
import layout from '../../templates/components/g-map/route';
import { get, set } from '@ember/object';

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

  _requiredOptions: ['directions'],

  _addComponent() {
    const options = get(this, '_options');
    if (!options.directions) {
      delete options.directions;
    }
    set(this, 'mapComponent', new google.maps.DirectionsRenderer(options));
  }
});
