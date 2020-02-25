import MapComponent from './map-component';
import layout from '../../templates/components/g-map/control';
import { get, set } from '@ember/object';
import { resolve } from 'rsvp';

/**
 * @class Control
 * @namespace GMap
 * @module ember-google-maps/components/g-map/control
 * @extends GMap.MapComponent
 */
export default MapComponent.extend({
  layout,
  class: undefined,
  tagName: 'div',

  _type: 'control',

  _createOptions(options) {
    return {
      ...options,
      position: get(this, 'position'),
      map: this.map,
    };
  },

  _addComponent() {
    let _elementDestination = set(this, '_elementDestination', document.createElement('div'));
    let map = get(this, 'map');

    if (get(this, 'class')) {
      _elementDestination.classList.add(get(this, 'class'));
    }

    let controlPosition = google.maps.ControlPosition[get(this, 'position')];
    map.controls[controlPosition].push(_elementDestination);

    return resolve(
      set(this, 'mapComponent', _elementDestination)
    );
  },

  _updateComponent() {},
});
