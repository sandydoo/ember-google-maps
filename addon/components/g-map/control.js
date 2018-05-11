import MapComponent from './map-component';
import layout from '../../templates/components/g-map/control';
import { get, set } from '@ember/object';

/**
 * @class Control
 * @namespace GMap
 * @module ember-google-maps/components/g-map/control
 * @extends GMap.MapComponent
 */
export default MapComponent.extend({
  layout,
  tagName: 'div',

  _type: 'control',
  _requiredOptions: ['position'],

  _addComponent() {
    let _elementDestination = set(this, '_elementDestination', document.createElement('div'));
    let map = get(this, 'map');

    let controlPosition = google.maps.ControlPosition[get(this, 'position')];
    map.controls[controlPosition].push(_elementDestination);

    set(this, 'mapComponent', _elementDestination);
  }
});
