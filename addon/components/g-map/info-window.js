import MapComponent from './map-component';
import layout from '../../templates/components/g-map/info-window';
import { computed, get, getProperties, set, setProperties } from '@ember/object';

/**
 * A wrapper for the google.maps.InfoWindow class.
 *
 * @class InfoWindow
 * @namespace GMap
 * @module ember-google-maps/components/g-map/info-window
 * @extends GMap.MapComponent
 */
export default MapComponent.extend({
  layout,

  _type: 'infoWindow',

  _ignoredAttrs: ['isOpen', 'target'],
  _requiredOptions: ['content'],

  isOpen: false,
  _cachedIsOpen: false,

  position: computed('lat', 'lng', function() {
    const { lat, lng } = getProperties(this, 'lat', 'lng');
    if (lat && lng) {
      return new google.maps.LatLng(lat, lng);
    }
  }),

  init() {
    this._super(...arguments);
    if (!get(this, 'target')) {
      this._requiredOptions = this._requiredOptions.concat(['position']);
    }
    setProperties(this.publicAPI.actions, {
      open: () => this.open(),
      close: () => this.close()
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);

    let isOpen = get(this, 'isOpen');
    let isOpenChanged = this._cachedIsOpen !== isOpen;

    if (isOpenChanged && isOpen) {
      this.open();
    } else if (isOpenChanged && !isOpen) {
      this.close();
    }

    set(this, '_cachedIsOpen', isOpen);
  },

  _addComponent() {
    this._prepareContent();
    let options = get(this, '_options');
    delete options.map;
    set(this, 'mapComponent', new google.maps.InfoWindow(options));
  },

  _didAddComponent() {
    if (get(this, 'isOpen')) {
      this.open();
    }
    this._super(...arguments);
  },

  _updateComponent() {
    let options = get(this, '_options');
    if (!get(this, 'isOpen')) {
      delete options.content;
    }
    this.mapComponent.setOptions(options);
  },

  _prepareContent() {
    if (!get(this, 'content')) {
      const content = document.createElement('div');
      set(this, '_targetPane', content);
      set(this, 'content', content);
    }
  },

  open() {
    if (this.mapComponent) {
      google.maps.event.addListenerOnce(this.mapComponent, 'closeclick', () => {
        set(this, 'isOpen', false);
      });
      this.mapComponent.open(get(this, 'map'), get(this, 'target'));
    }
  },

  close() {
    if (this.mapComponent) {
      this.mapComponent.close();
    }
  }
});
