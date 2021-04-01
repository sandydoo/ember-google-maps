import MapComponent from './map-component';
import layout from '../../templates/components/g-map/control';
import {
  ignoredOptions,
  parseOptionsAndEvents,
} from '../../utils/options-and-events';
import { get, getProperties, set } from '@ember/object';
import { resolve } from 'rsvp';

/**
 * @class Control
 * @namespace GMap
 * @module ember-google-maps/components/g-map/control
 * @extends GMap.MapComponent
 */
export default MapComponent.extend({
  layout,

  _type: 'control',

  _optionsAndEvents: parseOptionsAndEvents([
    ...ignoredOptions,
    'index',
    'class',
  ]),

  _addComponent() {
    let _elementDestination = set(
      this,
      '_elementDestination',
      document.createElement('div')
    );
    let { map, class: classNames, index } = getProperties(this, [
      'map',
      'class',
      'index',
    ]);

    if (classNames) {
      _elementDestination.classList.add(classNames);
    }

    if (Number.isInteger(index)) {
      _elementDestination.index = index;
    }

    let controlPosition = google.maps.ControlPosition[get(this, 'position')];
    map.controls[controlPosition].push(_elementDestination);

    return resolve(set(this, 'mapComponent', _elementDestination));
  },

  _updateComponent() {},
});
