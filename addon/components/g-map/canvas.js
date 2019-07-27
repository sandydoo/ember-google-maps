import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { bool } from '@ember/object/computed';

/**
 * Renders a canvas div into which the map is inserted.
 *
 * @class Canvas
 * @namespace GMap
 * @module ember-google-maps/components/g-map/canvas
 * @extends Ember.Component
 */
export default Component.extend({
  tagName: '',

  _hasCustomCanvas: bool('_customCanvas'),

  _shouldRenderDefaultCanvas: computed('_isInitialRender', '_hasCustomCanvas', function() {
    return get(this, '_isInitialRender') || !get(this, '_hasCustomCanvas');
  }),

  didInsertElement() {
    this._super(...arguments);

    if (this._customCanvas) { return; }

    let id = get(this, 'id');
    let canvas = document.getElementById(id);

    this._internalAPI._registerCanvas(canvas);
  }
});
