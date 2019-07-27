import Component from '@ember/component';
import ProcessOptions from '../mixins/process-options';
import RegisterEvents from '../mixins/register-events';
import PublicAPI from '../utils/public-api';
import layout from '../templates/components/g-map';
import { position as center } from '../utils/helpers';
import { inject as service } from '@ember/service';
import { computed, get, set, setProperties } from '@ember/object';
import { not, reads } from '@ember/object/computed';
import { guidFor } from '@ember/object/internals';
import { A } from '@ember/array';
import { tryInvoke } from '@ember/utils';
import { all, defer } from 'rsvp';
import { scheduleOnce } from '@ember/runloop';
import { task } from 'ember-concurrency';

const GMapAPI = {
  id: 'mapId',
  map: 'map',
  components: 'components',
  actions: {
    update: '_updateMap',
    trigger: '_trigger',
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

  /**
   * We detect whether there is a custom canvas on initial render.
   */
  _isInitialRender: true,

  _customCanvas: null,

  _needsCanvas: not('_customCanvas'),

  init() {
    this._super(...arguments);

    this.components = {};
    this.gMap = {};

    this.publicAPI = new PublicAPI(this, GMapAPI);

    this._internalAPI = {
      _registerCanvas: this._registerCanvas.bind(this),
      _registerComponent: this._registerComponent.bind(this),
      _unregisterComponent: this._unregisterComponent.bind(this)
    };

    this._canvasIsRendering = defer();

    get(this, '_initMap').perform();
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
  _initMap: task(function *() {
    yield get(this, 'google');

    let canvas = yield this._canvasIsRendering.promise;

    let options = get(this, '_options');
    let map = new google.maps.Map(canvas, options);

    google.maps.event.addListenerOnce(map, 'idle', () => {
      if (this.isDestroying || this.isDestroyed) { return; }

      set(this, 'map', map);
      this.registerEvents();

      tryInvoke(this, 'onLoad', [this.publicAPI]);

      scheduleOnce('afterRender', this, () => {
        if (this.isDestroying || this.isDestroyed) { return; }

        this._waitForComponents()
          .then(() => {
            this._componentsInitialized = true;
            tryInvoke(this, 'onComponentsLoad', [this.publicAPI]);
          });
      });
    });
  }),

  _waitForComponents() {
    let componentsAreInitialized =
      Object.keys(this.components)
        .map((name) => this.components[name])
        .reduce((array, componentGroup) => array.concat(componentGroup), [])
        .map((components) => get(components, 'isInitialized.promise'));

    return all(componentsAreInitialized);
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
  _trigger(...args) {
    google.maps.event.trigger(get(this, 'map'), ...args);
  },

  _registerCanvas(canvas) {
    set(this, 'canvas', canvas);

    this._notifyCanvasHasRendered();
  },

  _notifyCanvasHasRendered() {
    this._canvasIsRendering.resolve(this.canvas);
  },

  _endInitialRender() {
    scheduleOnce('afterRender', this, () => {
      if (this.canvas) {
        set(this, '_customCanvas', this.canvas);
      }

      set(this, '_isInitialRender', false);
    });
  },

  /**
   * Register a contextual component with the map component.
   *
   * @method _registerComponent
   * @param {String} type Plural name of the component
   * @param {Object} componentAPI
   * @return
   */
  _registerComponent(type, componentAPI) {
    this.components[type] = this.components[type] || A();
    this.components[type].pushObject(componentAPI);
  },

  /**
   * Unregister a contextual component with the map component.
   *
   * @method _unregisterComponent
   * @param {String} type Name of the component
   * @param {Object} componentAPI
   * @return
   */
  _unregisterComponent(type, componentAPI) {
    this.components[type].removeObject(componentAPI);
  },

  _updateGMap(...props) {
    setProperties(this.gMap, Object.assign({}, ...props));
  }
});
