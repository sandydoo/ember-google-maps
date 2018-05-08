import MapComponent from './map-component';
import { get, set } from '@ember/object';

/**
 * A wrapper for the google.maps.Polyline class.
 *
 * @class Polyline
 * @namespace GMap
 * @module ember-google-maps/components/g-map/polyline
 * @extends GMap.MapComponent
 */
export default MapComponent.extend({
  _type: 'polyline',
  _requiredOptions: ['path'],
  _watchedOptions: ['path.[]'],

  _addComponent() {
    set(this, 'mapComponent', new google.maps.Polyline(get(this, '_options')));
  }
});
