import Base from './base';
import layout from '../../templates/components/g-map/autocomplete';
import { computed, get, set } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { guidFor } from '@ember/object/internals';

export default Base.extend({
  layout,

  tagName: '',
  classNames: ['ember-google-maps-autocomplete'],

  _type: 'autocomplete',
  _ignoreAttrs: ['onSearch', 'onInput'],

  init() {
    this._super(...arguments);
    this.inputId = `pac-input-${guidFor(this)}`;
  },

  inputClasses: computed('classNames', function() {
    return get(this, 'classNames').join(' ');
  }),

  _onInput(value) {
    tryInvoke(this, 'onInput', [value]);
  },

  _addComponent() {
    let map = get(this, 'map');
    let inputElement = document.getElementById(this.inputId);
    let autocomplete = new google.maps.places.Autocomplete(inputElement, get(this, '_options'));
    set(this, 'mapComponent', autocomplete);

    // Bias the search results to the current map bounds.
    autocomplete.setBounds(map.getBounds());

    map.addListener('bounds_changed', function() {
      autocomplete.setBounds(map.getBounds());
    });

    autocomplete.addListener('place_changed', this._onSearch.bind(this));

    this._didAddComponent();
  },

  _onSearch() {
    const place = this.mapComponent.getPlace();
    const map = get(this, 'map');
    if (place.geometry) {
      tryInvoke(this, 'onSearch', [{ place, map }]);
    }
  }
});
