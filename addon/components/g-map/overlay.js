import Base from './base';
import layout from '../../templates/components/g-map/overlay';
import { computed, get, getProperties, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { schedule } from '@ember/runloop';
import { guidFor } from '@ember/object/internals';

export default Base.extend({
  layout,

  _type: 'overlay',

  markerStyle: htmlSafe('position: absolute; opacity: 0.01;'),
  width: 0,
  height: 0,
  paneName: 'overlayMouseTarget',

  domComponent: reads('content'),
  _targetPane: null,

  _contentId: computed(function() {
    return `ember-google-maps-overlay-${guidFor(this)}`;
  }),

  position: computed('lat', 'lng', function() {
    const { lat, lng } = getProperties(this, 'lat', 'lng');
    return new google.maps.LatLng(lat, lng);
  }),

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
    this.computeDimensions();
    this.mapComponent.draw();
  },

  add() {
    if (this.isDestroyed || this.isDestroying) { return; }
    const panes = this.mapComponent.getPanes();
    set(this, '_targetPane', get(panes, this.paneName));

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

    const height = this.height;
    const width = this.width / 2;

    this.content.style.cssText = `display: block; position: absolute; left: ${point.x - width}px; top: ${point.y - height}px; opacity: 1;`;

    if (!this._isInitialized) { this._didAddComponent(); }
  },

  fetchOverlayContent() {
    if (this.isDestroyed || this.isDestroying) { return; }
    let element = document.getElementById(get(this, '_contentId'));
    set(this, 'content', element);
  },

  computeDimensions() {
    if (!this.content || this.isDestroyed || this.isDestroying) { return; }
    const { width, height } = this.content.getBoundingClientRect();
    this.width = width;
    this.height = height;
  },

  getPosition() {
    return get(this, 'position');
  }
});
