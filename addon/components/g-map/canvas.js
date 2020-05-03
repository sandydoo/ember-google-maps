import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { bool } from '@ember/object/computed';
import { scheduleOnce } from '@ember/runloop';


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

  // TODO: Remove in Octane version. Use `...attributes` instead.
  computedClasses: computed('class', 'classNames', function() {
    let classes = [
      'ember-google-map',
      get(this, 'class'),
      get(this, 'classNames')
    ];
    return classes.filter(x => x).join(' ');
  }),

  didInsertElement() {
    this._super(...arguments);

    if (this._customCanvas) { return; }

    function registerCanvas() {
      let id = get(this, 'id');
      let canvas = document.getElementById(id);

      this._internalAPI._registerCanvas(canvas);
    }

    // TODO: Remove in Octane version. Splattributes somehow affect the
    // rendering loop, so this is necessary for 2.18.
    scheduleOnce('render', this, registerCanvas);
  }
});
