import Component from '@ember/component';
import RegisterEvents from '../../mixins/register-events';
import MapComponent from '../../mixins/map-component';
import { get, set } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { guidFor } from '@ember/object/internals';
import { defer } from 'rsvp';

/**
 * @class Base
 * @module ember-google-maps/components/g-map/base
 * @namespace GMap
 * @extends Component
 * @uses RegisterEvents
 * @uses MapComponent
 */
const Base = Component.extend(RegisterEvents, MapComponent, {
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
    tryInvoke(this.mapComponent, 'setMap', [null]);
    this._internalAPI._unregisterComponent(this._type, this.publicAPI);
    this._super(...arguments);
  },

  _updateOrAddComponent() {
    if (get(this, 'map')) {
      if (this._isInitialized) {
        this._updateComponent();
      } else {
        this._addComponent();
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
  },

  /**
   * @method getPosition
   * @public
   * @return {[google.maps.LatLng]}
   */
  getPosition() {
    return this.mapComponent && this.mapComponent.getPosition();
  }
});

Base.reopenClass({
  positionalParams: ['map', '_internalAPI']
});

export default Base;
