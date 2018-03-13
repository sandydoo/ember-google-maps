import Base from './base';
import layout from '../../templates/components/g-map/marker';
import { computed, get, getProperties, set } from '@ember/object';

/**
 * A wrapper for the google.maps.Marker class.
 *
 * @class Marker
 * @namespace GMap
 * @module ember-google-maps/components/g-map/marker
 * @extends GMap.Base
 */
export default Base.extend({
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
    this._didAddComponent();
  }
});
