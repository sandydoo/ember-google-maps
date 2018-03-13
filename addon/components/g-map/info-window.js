import Base from './base';
import layout from '../../templates/components/g-map/info-window';
import { computed, get, getProperties, set, setProperties } from '@ember/object';
import { schedule } from '@ember/runloop';

/**
 * A wrapper for the google.maps.InfoWindow class.
 *
 * @class InfoWindow
 * @namespace GMap
 * @module ember-google-maps/components/g-map/info-window
 * @extends GMap.Base
 */
export default Base.extend({
  layout,

  _type: 'infoWindow',

  _ignoreAttrs: ['isOpen'],
  _requiredOptions: ['content'],

  isOpen: false,

  position: computed('lat', 'lng', function() {
    const { lat, lng } = getProperties(this, 'lat', 'lng');
    return new google.maps.LatLng(lat, lng);
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
    if (get(this, 'isOpen')) {
      this.open();
    } else {
      this.close();
    }
  },

  _addComponent() {
    this._prepareContent();
    let options = get(this, '_options');
    delete options.map;
    set(this, 'mapComponent', new google.maps.InfoWindow(options));
    this._didAddComponent();
  },

  _didAddComponent() {
    if (get(this, 'isOpen')) {
      this.open();
    }
    this._super(...arguments);
  },

  _prepareContent() {
    if (!get(this, 'content')) {
      const content = document.createElement('div');
      set(this, '_targetPane', content);
      set(this, 'content', content);
    }
  },

  open() {
    schedule('actions', () => {
      if (this.mapComponent) {
        google.maps.event.addListenerOnce(this.mapComponent, 'closeclick', () => {
          set(this, 'isOpen', false);
        });
        this.mapComponent.open(get(this, 'map'), get(this, 'target'));
      }
    });
  },

  close() {
    schedule('actions', () => {
      this.mapComponent && this.mapComponent.close();
    });
  }
});
