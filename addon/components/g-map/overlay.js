import { default as MapComponent, MapComponentLifecycleEnum } from './map-component';
import layout from '../../templates/components/g-map/overlay';
import { addEventListeners, ignoredOptions, parseOptionsAndEvents } from '../../utils/options-and-events';
import { position } from '../../utils/helpers';
import { computed, get, set } from '@ember/object';
import { bind, scheduleOnce, run } from '@ember/runloop';
import { guidFor } from '@ember/object/internals';
import { warn } from '@ember/debug';
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
  zIndex: 'auto',

  _targetPane: null,

  _contentId: computed(function() {
    return `ember-google-maps-overlay-${guidFor(this)}`;
  }),

  _optionsAndEvents: parseOptionsAndEvents([...ignoredOptions, 'paneName', 'zIndex']),

  init() {
    this._super(arguments);

    // Remove for 4.0
    warn(
      `
The \`innerContainerStyle\` option has been removed. See the docs for examples of how to offset overlays relative to their coordinates.
https://ember-google-maps.sandydoo.me/docs/overlays/`,
      typeof this.innerContainerStyle === 'undefined',
      { id: 'inner-container-style-removed' }
    );
  },

  _addComponent() {
    let isFinishedDrawing = defer();

    let _contentContainer = document.createElement('div');
    _contentContainer.setAttribute('id', get(this, '_contentId'));

    let Overlay = new google.maps.OverlayView();

    // Flush the runloop to get the rendered overlay content.
    Overlay.onAdd = () => run(this, this.onAdd);

    Overlay.draw = () => scheduleOnce('render', this, this._initialDraw, isFinishedDrawing.resolve);

    Overlay.onRemove = bind(this, 'onRemove');

    set(this, 'mapComponent', Overlay);

    set(this, '_contentContainer', _contentContainer);
    this.mapComponent.setMap(this.map);

    return isFinishedDrawing.promise;
  },

  _didAddComponent(_, options, events) {
    let payload = {
      map: this.map,
      publicAPI: this.publicAPI,
    };

    addEventListeners(this._contentContainer, events, payload)
      .forEach(({ name, remove }) => this._eventListeners.set(name, remove));

    return resolve();
  },

  _updateComponent() {
    if (this.mapComponentLifecycle === READY) {
      this.mapComponent.draw();
    }
  },

  _initialDraw(callback) {
    this.draw();
    this.mapComponent.draw = () => scheduleOnce('render', this, 'draw');
    callback();
  },

  onAdd() {
    if (this.isDestroying || this.isDestroyed) { return; }

    let panes = this.mapComponent.getPanes();
    set(this, '_targetPane', panes[this.paneName]);

    this._targetPane.appendChild(this._contentContainer);
  },

  draw() {
    if (this.isDestroying || this.isDestroyed) { return; }

    let overlayProjection = this.mapComponent.getProjection(),
        position = get(this, 'position'),
        point = overlayProjection.fromLatLngToDivPixel(position),
        zIndex = get(this, 'zIndex');

    this._contentContainer.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      height: 0;
      z-index: ${zIndex};
      transform: translateX(${point.x}px) translateY(${point.y}px);
    `;
  },

  onRemove() {
    let parentNode = this._contentContainer.parentNode;

    if (parentNode) {
      parentNode.removeChild(this._contentContainer);
    }

    this._contentContainer = null;

    this.destroy();
  }
});
