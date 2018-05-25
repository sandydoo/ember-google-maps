import MapComponent from './map-component';
import layout from '../../templates/components/g-map/autocomplete';
import { get, set } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { assert } from '@ember/debug';

/**
 * @class Autocomplete
 * @namespace GMap
 * @module ember-google-maps/components/g-map/autocomplete
 * @extends GMap.MapComponent
 */
export default MapComponent.extend({
  layout,
  tagName: 'div',

  _type: 'autocomplete',
  _ignoredAttrs: ['onSearch'],

  init() {
    this._super(...arguments);

    this.publicAPI.reopen({
      place: 'place'
    });
  },

  _addComponent() {
    let map = get(this, 'map');

    let inputElement = this.element.querySelector('input');

    assert('You must define your own input within the ember-google-maps autocomplete block.', inputElement);

    let autocomplete = new google.maps.places.Autocomplete(inputElement, get(this, '_options'));
    set(this, 'mapComponent', autocomplete);

    // Bias the search results to the current map bounds.
    autocomplete.setBounds(map.getBounds());

    map.addListener('bounds_changed', function() {
      autocomplete.setBounds(map.getBounds());
    });

    autocomplete.addListener('place_changed', this._onSearch.bind(this));
  },

  _onSearch() {
    this.place = this.mapComponent.getPlace();

    if (this.place.geometry) {
      tryInvoke(this, 'onSearch', [this.publicAPI]);
    }
  }
});
