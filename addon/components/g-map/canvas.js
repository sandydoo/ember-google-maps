import Component from '@ember/component';

/**
 * Renders a canvas div into which the map is inserted.
 *
 * @class Canvas
 * @namespace GMap
 * @module ember-google-maps/components/g-map/canvas
 * @extends Ember.Component
 */
export default Component.extend({
  classNames: ['ember-google-map'],

  init() {
    this._super(...arguments);
    this._internalAPI._registerCanvas(this, this._isCustomCanvas);
  }
});
