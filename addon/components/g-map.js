import Component from '@ember/component';
import RegisterEvents from '../mixins/register-events';
import MapComponent from '../mixins/map-component';
import layout from '../templates/components/g-map';
import { inject as service } from '@ember/service';
import { computed, get, getProperties, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { guidFor } from '@ember/object/internals';
import { A } from '@ember/array';
import { tryInvoke } from '@ember/utils';
import { all } from 'rsvp';
import { next } from '@ember/runloop';
import { assign } from '@ember/polyfills';

export default Component.extend(RegisterEvents, MapComponent, {
  layout,

  googleMapsAPI: service(),

  tagName: '',

  _requiredOptions: ['center', 'zoom'],
  _customCanvasRegistered: false,

  zoom: 8,

  google: reads('googleMapsAPI.google'),
  mapComponent: reads('map'),

  mapId: computed(function() {
    return `ember-google-map-${guidFor(this)}`;
  }),

  center: computed('lat', 'lng', function() {
    const { lat, lng } = getProperties(this, 'lat', 'lng');
    return new google.maps.LatLng(lat, lng);
  }),

  init() {
    this._super(...arguments);

    const componentNames = ['markers', 'circles', 'polylines', 'overlays', 'controls', 'autocompletes', 'infoWindows', 'routes', 'directions'];
    this.components = {}
    componentNames.forEach((name) => {
      this.components[name] = A();
    });

    const publicAPI = {
      id: get(this, 'mapId'),
      actions: {
        update: () => this._updateMap(),
        trigger: () => this._trigger()
      }
    };
    set(this, 'publicAPI', assign({}, this.components, publicAPI));

    set(this, '_internalAPI', {
      _registerCanvas: this._registerCanvas.bind(this),
      _registerComponent: this._registerComponent.bind(this),
      _unregisterComponent: this._unregisterComponent.bind(this)
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'map')) {
      this.notifyPropertyChange('options');
    }
  },

  didInsertElement() {
    this._super(...arguments);
    get(this, 'google').then(() => next(this, '_initMap'));
  },

  _initMap() {
    if (this.isDestroying || this.isDestroyed) { return; }

    const canvas = get(this, 'canvas.element');
    const options = get(this, '_options');

    const map = new google.maps.Map(canvas, options);
    const publicAPI = this.publicAPI;

    google.maps.event.addListenerOnce(map, 'idle', () => {
      if (this.isDestroying || this.isDestroyed) { return; }

      set(this, 'map', map);

      this.registerEvents();
      tryInvoke(this, 'onLoad', [{ map, publicAPI }]);

      let componentInitPromises =
        Object.values(this.components)
          .reduce((a, b) => a.concat(b))
          .map((a) => a.isInitialized.promise);

      all(componentInitPromises)
        .then(() => {
          tryInvoke(this, 'onComponentsLoad', [
            { map: this.map, publicAPI: this.publicAPI }
          ]);
        });
    });
  },

  _updateMap() {
    const options = get(this, '_options');
    get(this, 'map').setOptions(options);
  },

  _trigger(event) {
    google.maps.event.trigger(get(this, 'map'), event);
  },

  _registerCanvas(canvas, isCustomCanvas = false) {
    set(this, 'canvas', canvas);
    set(this, '_customCanvasRegistered', isCustomCanvas);
  },

  _registerComponent(type, component) {
    get(this, `components.${type}s`).pushObject(component);
  },

  _unregisterComponent(type, component) {
    get(this, `components.${type}s`).removeObject(component);
  }
});
