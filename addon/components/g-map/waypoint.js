import Component from '@ember/component';
import ProcessOptions from '../../mixins/process-options';
import { get } from '@ember/object';

/**
 * A utility component to add waypoints to the directions component.
 *
 * @class Waypoint
 * @namespace GMap
 * @module ember-google-maps/components/g-map/waypoint
 * @extends Ember.Component
 * @uses ProcessOptions
 */
export default Component.extend(ProcessOptions, {
  tagName: '',

  _requiredOptions: ['location'],
  _ignoredAttrs: ['_registerWaypoint', '_unregisterWaypoint'],

  didReceiveAttrs() {
    this._super(...arguments);

    this._registerWaypoint(get(this, '_options'));
  },

  willDestroyElement() {
    this._super(...arguments);

    this._unregisterWaypoint(get(this, '_options'));
  }
});
