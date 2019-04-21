import MapComponent from './map-component';
import layout from '../../templates/components/g-map/autocomplete';
import { ignoredOptions, parseOptionsAndEvents } from '../../utils/options-and-events';
import { get, set } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { assert } from '@ember/debug';
import { resolve } from 'rsvp';

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

  _optionsAndEvents: parseOptionsAndEvents([...ignoredOptions, 'onSearch']),

  init() {
    this._super(...arguments);

    this.publicAPI.reopen({
      place: 'place'
    });
  },

  _addComponent(options) {
    let map = get(this, 'map');

    let inputElement = this.element.querySelector('input');

    assert('You must define your own input within the ember-google-maps autocomplete block.', inputElement);

    let autocomplete = new google.maps.places.Autocomplete(inputElement, options);
    set(this, 'mapComponent', autocomplete);

    // Bias the search results to the current map bounds.
    autocomplete.setBounds(map.getBounds());

    map.addListener('bounds_changed', function() {
      autocomplete.setBounds(map.getBounds());
    });

    autocomplete.addListener('place_changed', this._onSearch.bind(this));

    return resolve(this.mapComponent);
  },

  _onSearch() {
    this.place = this.mapComponent.getPlace();

    if (this.place.geometry) {
      tryInvoke(this, 'onSearch', [this.publicAPI]);
    }
  }
});
