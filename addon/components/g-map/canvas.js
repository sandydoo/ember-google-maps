import Component from '@ember/component';
import { computed, get } from '@ember/object';


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

    let id = get(this, 'id');
    let canvas = document.getElementById(id);

    this._internalAPI._registerCanvas(canvas);
  }
});
