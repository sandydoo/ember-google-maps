import MapComponent from './map-component';
import layout from '../../templates/components/g-map/marker';
import { computed, get, getProperties, set } from '@ember/object';

/**
 * A wrapper for the google.maps.Marker class.
 *
 * @class Marker
 * @namespace GMap
 * @module ember-google-maps/components/g-map/marker
 * @extends GMap.MapComponent
 */
export default MapComponent.extend({
  layout,
  tagName: '',

  _requiredOptions: ['position'],

  _type: 'marker',

  position: computed('lat', 'lng', function() {
    const { lat, lng } = getProperties(this, 'lat', 'lng');
    return new google.maps.LatLng(lat, lng);
  }),

  _addComponent() {
    set(this, 'mapComponent', new google.maps.Marker(get(this, '_options')));
  },

  /**
   * @method getPosition
   * @public
   * @return {[google.maps.LatLng]}
   */
  getPosition() {
    return this.mapComponent && this.mapComponent.getPosition();
  }
});
