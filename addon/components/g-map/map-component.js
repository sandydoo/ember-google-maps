import Component from '@ember/component';
import ProcessOptions from '../../mixins/process-options';
import RegisterEvents from '../../mixins/register-events';
import { get, set } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { guidFor } from '@ember/object/internals';
import { defer, resolve } from 'rsvp';

/**
 * @class MapComponent
 * @module ember-google-maps/components/g-map/map-component
 * @namespace GMap
 * @extends Component
 * @uses ProcessOptions
 * @uses RegisterEvents
 */
const MapComponent = Component.extend(ProcessOptions, RegisterEvents, {
  tagName: '',

  _requiredOptions: ['map'],

  init() {
    this._super(...arguments);

    this.isInitialized = defer();
    this.publicAPI = {
      id: guidFor(this),
      isInitialized: this.isInitialized,
      actions: {
        update: () => this._updateComponent(),
        getPosition: () => this.getPosition(),
      }
    };
  },

  didInsertElement() {
    this._super(...arguments);
    this._internalAPI._registerComponent(this._type, this.publicAPI);
    this._updateOrAddComponent();
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this._updateOrAddComponent();
  },

  willDestroyElement() {
    this._super(...arguments);
    tryInvoke(this.mapComponent, 'setMap', [null]);
    this._internalAPI._unregisterComponent(this._type, this.publicAPI);
  },

  _updateOrAddComponent() {
    if (get(this, 'map')) {
      if (this._isInitialized) {
        this._updateComponent();
      } else {
        let addComponent = this._addComponent() || resolve();
        addComponent.then(this._didAddComponent.bind(this));
      }
    }
  },

  /**
   * Run when the map component is first initialized. Normally this happens as
   * soon as the map is ready.
   *
   * @method _addComponent
   * @return
   */
  _addComponent() {},

  /**
   * Run after the map component has been initialized. This hook should be used
   * to register events, expose the mapComponent, etc.
   *
   * @method _didAddComponent
   * @return
   */
  _didAddComponent() {
    set(this, 'publicAPI.mapComponent', this.mapComponent);
    this.registerEvents();
    set(this, '_isInitialized', true);
    this.isInitialized.resolve();
  },

  /**
   * Run when any of the attributes or watched options change.
   *
   * @method _updateComponent
   * @return
   */
  _updateComponent() {
    let options = get(this, '_options');
    this.mapComponent.setOptions(options);
  }
});

MapComponent.reopenClass({
  positionalParams: ['map', '_internalAPI']
});

export default MapComponent;
