import Mixin from '@ember/object/mixin';
import { computed, get, getProperties } from '@ember/object';
import { assign } from '@ember/polyfills';

function addObservers(obj, keys, callback) {
  keys.forEach((key) => obj.addObserver(key, callback));
}

function removeObservers(obj, keys, callback) {
  keys.forEach((key) => obj.removeObserver(key, callback));
}

/**
 * @class MapComponent
 * @module ember-google-maps/mixins/map-component
 * @extends Ember.Mixin
 */
export default Mixin.create({
  /**
   * Specify which attributes on the component should be ignored and never
   * considered as a Google Maps option or event.
   *
   * @property _ignoreAttrs
   * @private
   * @type {String[]}
   */
  _ignoreAttrs: ['map', '_internalAPI', 'lat', 'lng'],

  concatenatedProperties: ['_requiredOptions', '_watchedOptions', '_ignoreAttrs'],

  /**
   * Required options that are always included in the options object passed to
   * the map component.
   *
   * @property _requiredOptions
   * @private
   * @type {String[]}
   */
  _requiredOptions: [],

  /**
   * Paths to watch for changes. The paths follow the same syntax as the keys
   * for Ember observers and computed properties.
   *
   * @property _watchedOptions
   * @private
   * @type {String[]}
   */
  _watchedOptions: [],

  /**
   * Combined object of options and events used to set and update the options
   * on the map component.
   *
   * @property options
   * @public
   * @return {Object}
   */
  options: computed('attrs', 'events', function() {
    let attrs = Object.keys(this.attrs).filter((k) => {
      return [...get(this, '_ignoreAttrs'), ...(get(this, 'events') || [])].indexOf(k) === -1;
    });
    return getProperties(this, attrs);
  }),

  _options: computed('map', 'options', function() {
    let options = get(this, 'options');
    let required = getProperties(this, get(this, '_requiredOptions'));
    return assign(required, options);
  }),

  init() {
    this._super(...arguments);
    let watched = get(this, '_watchedOptions');

    if (watched.length > 0) {
      addObservers(this, watched, this._updateComponent);
    }
  },

  willDestroyElement() {
    removeObservers(this, get(this, '_watchedOptions'), this._updateComponent);
    this._super(...arguments);
  }
});
