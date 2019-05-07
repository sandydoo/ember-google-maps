import { default as MapComponent, MapComponentLifecycleEnum } from './map-component';
import layout from '../../templates/components/g-map/overlay';
import { addEventListeners, ignoredOptions, parseOptionsAndEvents } from '../../utils/options-and-events';
import { position } from '../../utils/helpers';
import { computed, get, set } from '@ember/object';
import { bind, once, scheduleOnce } from '@ember/runloop';
import { guidFor } from '@ember/object/internals';
import { assert, warn } from '@ember/debug';
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

      (this.mapComponent.draw = bind(this, () => scheduleOnce('render', this, 'draw')))();

      isFinishedDrawing.resolve(this.mapComponent);
    }

    Overlay.onAdd = bind(this, () => once(this, onAdd));

    Overlay.draw = bind(this, () => scheduleOnce('afterRender', this, initialDraw));

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

    let overlayProjection = this.mapComponent.getProjection(),
        position = get(this, 'position'),
        point = overlayProjection.fromLatLngToDivPixel(position),
        zIndex = get(this, 'zIndex');

    this.content.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      height: 0;
      z-index: ${zIndex};
      transform: translateX(${point.x}px) translateY(${point.y}px);
    `;
  },

  fetchOverlayContent(id) {
    return document.getElementById(id);
  }
});
