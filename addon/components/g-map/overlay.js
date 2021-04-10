import MapComponent from './map-component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import { toLatLng } from '../../utils/helpers';
import { addEventListeners } from '../../utils/options-and-events';

export default class OverlayView extends MapComponent {
  id = `ember-google-maps-overlay-${guidFor(this)}`;

  container = window?.document?.createDocumentFragment();

  get zIndex() {
    return this.args.zIndex ?? 'auto';
  }

  get paneName() {
    return this.args.paneName ?? 'overlayMouseTarget';
  }

  get position() {
    let { lat, lng, position } = this.args;

    return position ?? toLatLng(lat, lng);
  }

  new() {
    let Overlay = new google.maps.OverlayView();

    Overlay.onAdd = () => this.onAdd();
    Overlay.onRemove = () => this.onRemove();
    Overlay.draw = () => this.draw();

    Overlay.setMap(this.context.map);

    return Overlay;
  }

  // TODO: support changing pane?
  // There’s nothing to update right now, but we need to make sure we’re not
  // creating new overlays whenever arguments are updated.
  update(overlay) {
    return overlay;
  }

  onAdd() {
    let panes = this.mapComponent.getPanes();
    this.targetPane = panes[this.paneName];

    this.targetPane.appendChild(this.overlayElement);

    addEventListeners(this.overlayElement, this.events, this.publicAPI);
  }

  draw() {
    let { position, zIndex } = this;

    let overlayProjection = this.mapComponent.getProjection();
    let point = overlayProjection.fromLatLngToDivPixel(position);

    this.overlayElement.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      height: 0;
      z-index: ${zIndex};
      transform: translateX(${point.x}px) translateY(${point.y}px);
    `;
  }

  onRemove() {
    let parentNode = this.overlayElement.parentNode;

    if (parentNode) {
      parentNode.removeChild(this.overlayElement);
    }
  }

  teardown() {
    // This calls onRemove.
    this.mapComponent.setMap(null);

    this.overlayElement = null;
    this.container = null;
  }

  @action
  getOverlay(element) {
    this.overlayElement = element;
  }
}
