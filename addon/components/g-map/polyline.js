import MapComponent from './map-component';
import { get, set } from '@ember/object';
import { watch } from '../../utils/options-and-events';
import { resolve } from 'rsvp';

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

  _createOptions(options) {
    return {
      ...options,
      path: get(this, 'path'),
      map: get(this, 'map'),
    };
  },

  _addComponent(options) {
    return resolve(
      set(this, 'mapComponent', new google.maps.Polyline(options))
    );
  },

  _didAddComponent() {
    let watched = watch(this,
      { 'path.[]': () => this._updateOrAddComponent() }
    );

    watched
      .forEach(({ name, remove }) => this._eventListeners.set(name, remove));

    return resolve();
  },
});
