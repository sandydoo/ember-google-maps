import Mixin from '@ember/object/mixin';
import { computed, get, getProperties } from '@ember/object';

function addObservers(obj, keys, callback) {
  keys.forEach((key) => obj.addObserver(key, callback));
}

function removeObservers(obj, keys, callback) {
  keys.forEach((key) => obj.removeObserver(key, callback));
}

export default Mixin.create({
  _ignoreAttrs: ['map', '_internalAPI', 'lat', 'lng'],

  concatenatedProperties: ['_requiredOptions', '_watchedOptions', '_ignoreAttrs'],

  _requiredOptions: ['map'],
  _watchedOptions: [],

  options: computed('attrs', 'events', function() {
    let attrs = Object.keys(this.attrs).filter((k) => {
      return [...get(this, '_ignoreAttrs'), ...get(this, 'events')].indexOf(k) < 0;
    });
    return getProperties(this, attrs);
  }),

  _options: computed('map', 'options', function() {
    let options = get(this, 'options');
    let required = getProperties(this, get(this, '_requiredOptions'));
    return Object.assign(required, options);
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
