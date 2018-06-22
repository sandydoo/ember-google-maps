import MapComponent from './map-component';
import layout from '../../templates/components/g-map/overlay';
import { position } from '../../utils/helpers';
import { computed, get, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { schedule } from '@ember/runloop';
import { guidFor } from '@ember/object/internals';
import { htmlSafe } from '@ember/string';
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

  position,

  paneName: 'overlayMouseTarget',

  _targetPane: null,
  _eventTarget: reads('content'),

  innerContainerStyle: htmlSafe('transform: translateX(-50%) translateY(-100%);'),

  _contentId: computed(function() {
    return `ember-google-maps-overlay-${guidFor(this)}`;
  }),

  _addComponent() {
    let Overlay = new google.maps.OverlayView();

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
    this.mapComponent.draw = () => this.draw();
    this._updateComponent();
    overlayCallback();
  },

  _updateComponent() {
    this.mapComponent.draw();
  },

  add() {
    let panes = this.mapComponent.getPanes();
    set(this, '_targetPane', get(panes, this.paneName));
  },

  draw() {
    let overlayProjection = this.mapComponent.getProjection();
    let position = get(this, 'position');
    let point = overlayProjection.fromLatLngToDivPixel(position);

    this.content.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      height: 0;
      transform: translateX(${point.x}px) translateY(${point.y}px);
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
