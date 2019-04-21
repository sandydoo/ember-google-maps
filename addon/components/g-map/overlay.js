import { default as MapComponent, MapComponentLifecycleEnum } from './map-component';
import layout from '../../templates/components/g-map/overlay';
import { addEventListeners } from '../../utils/options-and-events';
import { position } from '../../utils/helpers';
import { computed, get, set } from '@ember/object';
import { bind, once, scheduleOnce } from '@ember/runloop';
import { guidFor } from '@ember/object/internals';
import { htmlSafe } from '@ember/string';
import { assert } from '@ember/debug';
import { defer, resolve } from 'rsvp';


const { READY } = MapComponentLifecycleEnum;


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

  innerContainerStyle: htmlSafe('transform: translateX(-50%) translateY(-100%);'),

  _contentId: computed(function() {
    return `ember-google-maps-overlay-${guidFor(this)}`;
  }),

  _addComponent() {
    let isFinishedDrawing = defer();
    let Overlay = new google.maps.OverlayView();

    function onAdd() {
      if (this.isDestroyed) { return; }

      let panes = this.mapComponent.getPanes();
      set(this, '_targetPane', panes[this.paneName]);
    }

    function initialDraw() {
      if (this.isDestroyed) { return; }

      let contentId = get(this, '_contentId');
      let content = this.fetchOverlayContent(contentId);

      assert('No content', Boolean(content));

      set(this, 'content', content);

      (this.mapComponent.draw = () => scheduleOnce('render', this, 'draw'))();

      isFinishedDrawing.resolve(this.mapComponent);
    }

    Overlay.onAdd = () => once(this, onAdd);

    Overlay.draw = () => scheduleOnce('afterRender', this, initialDraw);

    Overlay.onRemove = bind(this, 'destroy');

    set(this, 'mapComponent', Overlay);

    this.mapComponent.setMap(this.map);

    return isFinishedDrawing.promise;
  },

  _didAddComponent(_, options, events) {
    let payload = {
      map: this.map,
      publicAPI: this.publicAPI,
    };

    addEventListeners(this.content, events, payload)
      .forEach(({ name, remove }) => this._eventListeners.set(name, remove));

    return resolve();
  },

  _updateComponent() {
    if (this.mapComponentLifecycle === READY) {
      this.mapComponent.draw();
    }
  },

  draw() {
    if (this.isDestroyed) { return; }

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

  fetchOverlayContent(id) {
    return document.getElementById(id);
  }
});
