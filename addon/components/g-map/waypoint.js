import Component from '@ember/component';
import { get } from '@ember/object';

function waypointAPI(target) {
  return {
    get location() {
      return get(target, 'location');
    }
  };
}

/**
 * A utility component to add waypoints to the directions component.
 *
 * @class Waypoint
 * @namespace GMap
 * @module ember-google-maps/components/g-map/waypoint
 * @extends GMap.MapComponent
 */
export default Component.extend({
  tagName: '',

  _type: 'waypoint',

  init() {
    this._super(...arguments);

    this.publicAPI = waypointAPI(this);

    this._internalAPI._registerComponent(this.publicAPI);
  },

  willDestroyElement() {
    this._super(...arguments);

    this._internalAPI._unregisterComponent(this.publicAPI);
  }
});
