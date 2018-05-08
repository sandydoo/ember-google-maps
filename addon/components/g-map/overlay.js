import MapComponent from './map-component';
import layout from '../../templates/components/g-map/overlay';
import { computed, get, getProperties, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { schedule } from '@ember/runloop';
import { guidFor } from '@ember/object/internals';
import { Promise } from 'rsvp';

/**
 * A wrapper for the google.maps.Overlay class.
 *
 * @class Overlay
 * @namespace GMap
 * @module ember-google-maps/components/g-map/overlay
 * @extends GMap.MapComponent
 */
export default MapComponent.extend({
  layout,

  _type: 'overlay',

  paneName: 'overlayMouseTarget',

  _elementDestination: null,
  _targetPane: null,

  _eventTarget: reads('content'),

  _contentId: computed(function() {
    return `ember-google-maps-overlay-${guidFor(this)}`;
  }),

  position: computed('lat', 'lng', function() {
    const { lat, lng } = getProperties(this, 'lat', 'lng');
    return new google.maps.LatLng(lat, lng);
  }),

  cachedBoundingClientRect: computed('content', function() {
    return this.content.getBoundingClientRect();
  }),

  init() {
    this._super(...arguments);
    this.publicAPI.actions.getBoundingClientRect = () => get(this, 'cachedBoundingClientRect');
  },

  _addComponent() {
    const Overlay = new google.maps.OverlayView();

    return new Promise((resolve) => {
      Overlay.onAdd = () => this.add();
      Overlay.draw = () => schedule('render', this, '_initialDraw', resolve);
      Overlay.onRemove = () => this.destroy();

      set(this, 'mapComponent', Overlay);
      this.mapComponent.setMap(get(this, 'map'));
    });
  },

  _initialDraw(overlayCallback) {
    this.fetchOverlayContent();
    get(this, 'cachedBoundingClientRect');
    this.mapComponent.draw = () => this.draw();
    this._updateComponent();
    overlayCallback();
  },

  _updateComponent() {
    this.notifyPropertyChange('cachedBoundingClientRect');
    this.mapComponent.draw();
  },

  add() {
    let panes = this.mapComponent.getPanes();
    let _elementDestination = set(this, '_elementDestination', document.createElement('div'));
    set(this, '_targetPane', get(panes, this.paneName));
    this._targetPane.appendChild(_elementDestination);
  },

  draw() {
    let overlayProjection = this.mapComponent.getProjection();
    let position = get(this, 'position');
    let point = overlayProjection.fromLatLngToDivPixel(position);

    let { width, height } = get(this, 'cachedBoundingClientRect');
    width /= 2;

    this.content.style.cssText = `
      display: block;
      position: absolute;
      left: ${point.x - width}px;
      top: ${point.y - height}px;
      opacity: 1;
    `;
  },

  fetchOverlayContent() {
    let element = document.getElementById(get(this, '_contentId'));
    set(this, 'content', element);
  },

  getPosition() {
    return get(this, 'position');
  }
});
