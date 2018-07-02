import MapComponent from './map-component';
import layout from '../../templates/components/g-map/info-window';
import { position } from '../../utils/helpers';
import { get, set } from '@ember/object';

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

  position,

  init() {
    this._super(...arguments);

    if (!get(this, 'target')) {
      this._requiredOptions = this._requiredOptions.concat(['position']);
    }

    this.publicAPI.reopen({
      actions: {
        open: 'open',
        close: 'close'
      }
    });
  },

  _addComponent() {
    this._prepareContent();

    let options = this._getOptions();

    set(this, 'mapComponent', new google.maps.InfoWindow(options));
  },

  _didAddComponent() {
    this._openOrClose();

    this._super(...arguments);
  },

  _updateComponent() {
    let options = this._getOptions();

    this.mapComponent.setOptions(options);

    this._openOrClose();
  },

  _getOptions() {
    let options = get(this, '_options');
    delete options.map;

    if (!get(this, 'isOpen')) {
      delete options.content;
    }

    return options;
  },

  _openOrClose() {
    let isOpen = get(this, 'isOpen');
    let isOpenChanged = this._cachedIsOpen !== isOpen;

    if (isOpenChanged && isOpen) {
      this.open();
    } else if (isOpenChanged && !isOpen) {
      this.close();
    }

    set(this, '_cachedIsOpen', isOpen);
  },

  _prepareContent() {
    if (!get(this, 'content')) {
      let content = document.createElement('div');

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
