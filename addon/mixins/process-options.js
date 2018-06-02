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
 * @class ProcessOptions
 * @module ember-google-maps/mixins/process-options
 * @extends Ember.Mixin
 */
export default Mixin.create({
  concatenatedProperties: ['_requiredOptions', '_watchedOptions', '_ignoredAttrs'],

  /**
   * Specify which attributes on the component should be ignored and never
   * considered as a Google Maps option or event.
   *
   * @property _ignoredAttrs
   * @private
   * @type {String[]}
   */
  _ignoredAttrs: ['map', '_internalAPI', 'gMap', 'lat', 'lng', 'events'],

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
    let { _ignoredAttrs, _eventAttrs } = getProperties(this, '_ignoredAttrs', '_eventAttrs');
    let ignoredAttrs = [..._ignoredAttrs, ..._eventAttrs];

    let attrs = Object.keys(this.attrs).filter((attr) => {
      return ignoredAttrs.indexOf(attr) === -1;
    });

    return getProperties(this, attrs);
  }),

  _options: computed('map', 'options', function() {
    let options = get(this, 'options');
    let _requiredOptions = get(this, '_requiredOptions');
    let required = getProperties(this, _requiredOptions);

    return assign(required, options);
  }),

  init() {
    this._super(...arguments);

    if (!this._eventAttrs) {
      this._eventAttrs = [];
    }

    let _watchedOptions = get(this, '_watchedOptions');
    if (_watchedOptions.length > 0) {
      addObservers(this, _watchedOptions, this._updateComponent);
    }
  },

  willDestroyElement() {
    let _watchedOptions = get(this, '_watchedOptions');
    removeObservers(this, _watchedOptions, this._updateComponent);

    this._super(...arguments);
  }
});
