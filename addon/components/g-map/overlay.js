import Base from './base';
import layout from '../../templates/components/g-map/overlay';
import { computed, get, getProperties, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { schedule } from '@ember/runloop';
import { guidFor } from '@ember/object/internals';

/**
 * A wrapper for the google.maps.Overlay class.
 *
 * @class Overlay
 * @namespace GMap
 * @module ember-google-maps/components/g-map/overlay
 * @extends GMap.Base
 */
export default Base.extend({
  layout,

  _type: 'overlay',

  paneName: 'overlayMouseTarget',

  _elementDestination: null,
  _targetPane: null,

  markerStyle: htmlSafe('position: absolute; opacity: 0.01;'),
  _eventTarget: reads('content'),

  _contentId: computed(function() {
    return `ember-google-maps-overlay-${guidFor(this)}`;
  }),

  position: computed('lat', 'lng', function() {
    const { lat, lng } = getProperties(this, 'lat', 'lng');
    return new google.maps.LatLng(lat, lng);
  }),

  cachedBoundingClientRect: computed('content', function() {
    if (!this.content || this.isDestroyed || this.isDestroying) { return; }
    return this.content.getBoundingClientRect();
  }),

  init() {
    this._super(...arguments);
    this.publicAPI.actions.getBoundingClientRect = () => get(this, 'cachedBoundingClientRect');
  },

  _addComponent() {
    const Overlay = new google.maps.OverlayView();
    Overlay.onAdd = () => this.add();
    Overlay.draw = () => {};
    Overlay.onRemove = () => this.destroy();

    set(this, 'mapComponent', Overlay);
    this.mapComponent.setMap(get(this, 'map'));
  },

  updateComponent() {
    if (!this.mapComponent) { return; }
    this.notifyPropertyChange('cachedBoundingClientRect');
    this.mapComponent.draw();
  },

  add() {
    if (this.isDestroyed || this.isDestroying) { return; }
    const panes = this.mapComponent.getPanes();
    const _elementDestination = set(this, '_elementDestination', document.createElement('div'));
    set(this, '_targetPane', get(panes, this.paneName));
    this._targetPane.appendChild(_elementDestination);

    schedule('afterRender', () => {
      this.fetchOverlayContent();
      this.mapComponent.draw = () => this.draw();
      this.updateComponent();
    });
  },

  draw() {
    if (!this.content || this.isDestroyed || this.isDestroying) { return; }

    const overlayProjection = this.mapComponent.getProjection();
    const position = get(this, 'position');
    const point = overlayProjection.fromLatLngToDivPixel(position);

    let { width, height } = get(this, 'cachedBoundingClientRect');
    width /= 2;

    this.content.style.cssText = `display: block; position: absolute; left: ${point.x - width}px; top: ${point.y - height}px; opacity: 1;`;

    if (!this._isInitialized) { this._didAddComponent(); }
  },

  fetchOverlayContent() {
    if (this.isDestroyed || this.isDestroying) { return; }
    let element = document.getElementById(get(this, '_contentId'));
    set(this, 'content', element);
  },

  getPosition() {
    return get(this, 'position');
  }
});
