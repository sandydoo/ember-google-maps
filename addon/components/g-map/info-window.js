import Base from './base';
import layout from '../../templates/components/g-map/info-window';
import { computed, get, getProperties, observer, set } from '@ember/object';
import { schedule } from '@ember/runloop';

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

  // This can be done using didReceiveAttrs + _didAddComponent, but this ends up
  // being less code.
  isOpenObserver: observer('isOpen', '_isInitialized', function() {
    if (this._isInitialized) {
      if (get(this, 'isOpen')) {
        this.open();
      } else {
        this.close();
      }
    }
  }),

  init() {
    this._super(...arguments);
    if (!get(this, 'target')) {
      this._requiredOptions = this._requiredOptions.concat(['position']);
    }
  },

  _addComponent() {
    this._prepareContent();
    let options = get(this, '_options');
    delete options.map;
    set(this, 'mapComponent', new google.maps.InfoWindow(options));
    this._didAddComponent();
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
