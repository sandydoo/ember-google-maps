import Component from '@ember/component';
import ProcessOptions from '../mixins/process-options';
import RegisterEvents from '../mixins/register-events';
import PublicAPI from '../utils/public-api';
import layout from '../templates/components/g-map';
import { position as center } from '../utils/helpers';
import { inject as service } from '@ember/service';
import { computed, get, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { guidFor } from '@ember/object/internals';
import { A } from '@ember/array';
import { tryInvoke } from '@ember/utils';
import { all } from 'rsvp';
import { next } from '@ember/runloop';

const GMapAPI = {
  id: 'mapId',
  map: 'map',
  components: 'components',
  actions: {
    update: '_updateMap',
    trigger: 'trigger',
  }
};

/**
 * @class GMap
 * @module ember-google-maps/components/g-map
 * @extends Ember.Component
 * @uses ProcessOptions
 * @uses RegisterEvents
 */
export default Component.extend(ProcessOptions, RegisterEvents, {
  /**
   * @property googleMapsApi
   * @type GoogleMapsApi
   * @readOnly
   */
  googleMapsApi: service(),

  layout,

  tagName: '',

  _requiredOptions: ['center', 'zoom'],

  /**
   * Track whether a custom canvas is used instead of the default one.
   *
   * @property _customCanvasRegistered
   * @type {Boolean}
   * @private
   */
  _customCanvasRegistered: false,

  /**
   * Zoom level for the map
   *
   * @property zoom
   * @type {Number}
   * @default 8
   * @public
   */
  zoom: 8,

  /**
   * The latitude and longitude of the center of the map.
   *
   * @property center
   * @type {google.maps.LatLng}
   * @public
   */
  center,

  google: reads('googleMapsApi.google'),
  mapComponent: reads('map'),

  /**
   * A unique id for the current map instance.
   *
   * @property mapId
   * @type {String}
   * @public
   */
  mapId: computed(function() {
    return `ember-google-map-${guidFor(this)}`;
  }),

  init() {
    this._super(...arguments);

    const componentNames = [
      'markers',
      'circles',
      'polylines',
      'overlays',
      'controls',
      'autocompletes',
      'infoWindows',
      'routes',
      'directions'
    ];

    this.components = {};
    componentNames.forEach((name) => {
      this.components[name] = A();
    });

    this.publicAPI = new PublicAPI(this, GMapAPI);

    this._internalAPI = {
      _registerCanvas: this._registerCanvas.bind(this),
      _registerComponent: this._registerComponent.bind(this),
      _unregisterComponent: this._unregisterComponent.bind(this)
    };
  },

  didInsertElement() {
    this._super(...arguments);

    get(this, 'google').then(() => next(this, '_initMap'));
  },

  didUpdateAttrs() {
    this._super(...arguments);

    if (get(this, 'map')) {
      this._updateMap();
    }
  },

  /**
   * Initialize the map, register events and prep internal components.
   *
   * @method _initMap
   * @private
   * @return
   */
  _initMap() {
    if (this.isDestroying || this.isDestroyed) { return; }

    let canvas = get(this, 'canvas.element');
    let options = get(this, '_options');

    let map = new google.maps.Map(canvas, options);

    google.maps.event.addListenerOnce(map, 'idle', () => {
      if (this.isDestroying || this.isDestroyed) { return; }

      set(this, 'map', map);
      this.registerEvents();

      tryInvoke(this, 'onLoad', [this.publicAPI]);

      let componentInitPromises =
        Object.keys(this.components)
          .map((key) => this.components[key])
          .reduce((a, b) => a.concat(b))
          .map((a) => get(a, 'isInitialized.promise'));

      all(componentInitPromises)
        .then(() => {
          this._componentsInitialized = true;
          tryInvoke(this, 'onComponentsLoad', [this.publicAPI]);
        });
    });
  },

  /**
   * Update the map options.
   *
   * @method _updateMap
   * @return
   */
  _updateMap() {
    let options = get(this, '_options');
    get(this, 'map').setOptions(options);
  },

  /**
   * Helper method to trigger Google Maps events.
   *
   * @method _trigger
   * @param {String} event Event name
   * @return
   */
  _trigger(event) {
    google.maps.event.trigger(get(this, 'map'), event);
  },

  _registerCanvas(canvas, isCustomCanvas = false) {
    set(this, 'canvas', canvas);
    set(this, '_customCanvasRegistered', isCustomCanvas);
  },

  /**
   * Register a contextual component with the map component.
   *
   * @method _registerComponent
   * @param {String} type Name of the component
   * @param {Ember.Component} component
   * @return
   */
  _registerComponent(type, component) {
    get(this, `components.${type}s`).pushObject(component);
  },

  /**
   * Unregister a contextual component with the map component.
   *
   * @method _unregisterComponent
   * @param {String} type Name of the component
   * @param {Ember.Component} component
   * @return
   */
  _unregisterComponent(type, component) {
    get(this, `components.${type}s`).removeObject(component);
  }
});
