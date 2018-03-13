import Component from '@ember/component';
import MapComponent from '../../mixins/map-component';
import { get } from '@ember/object';

/**
 * A utility component to add waypoints to the directions component.
 *
 * @class Waypoint
 * @namespace GMap
 * @module ember-google-maps/components/g-map/waypoint
 * @extends Ember.Component
 * @uses MapComponent
 */
export default Component.extend(MapComponent, {
  tagName: '',

  _requiredOptions: ['location'],
  _ignoreAttrs: ['_registerWaypoint', '_unregisterWaypoint'],

  didReceiveAttrs() {
    this._super(...arguments);
    this._registerWaypoint(get(this, '_options'));
  },

  willDestroyElement() {
    this._unregisterWaypoint(get(this, '_options'));
    this._super(...arguments);
  }
});
