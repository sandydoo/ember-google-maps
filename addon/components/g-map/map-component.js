import Component from '@ember/component';
import PublicAPI from '../../utils/public-api';
import { addEventListeners, ignoredOptions, parseOptionsAndEvents } from '../../utils/options-and-events';
import { get } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { tryInvoke } from '@ember/utils';
import { defer, resolve, reject } from 'rsvp';
import { assert } from '@ember/debug';


const MapComponentAPI = {
  map: 'map',
  mapComponent: 'mapComponent',
  isInitialized: 'isInitialized',
  actions: {
    update: '_updateComponent'
  }
};

const NOT_READY = 1,
      IN_PROGRESS = 2,
      READY = 3;

const MapComponentLifecycleEnum = {
  NOT_READY,
  IN_PROGRESS,
  READY,
};


/**
 * @class MapComponent
 * @module ember-google-maps/components/g-map/map-component
 * @namespace GMap
 * @extends Component
 */
const MapComponent = Component.extend({
  tagName: '',

  _type: undefined,

  mapComponentLifecycle: NOT_READY,


  /* Options and events */

  _createOptions(options) {
    return options;
  },

  _createEvents(events) {
    return events;
  },

  _optionsAndEvents: parseOptionsAndEvents(ignoredOptions),

  _options: readOnly('_optionsAndEvents.options'),

  _events: readOnly('_optionsAndEvents.events'),


  /* Lifecycle hooks */

  init() {
    this._super(...arguments);

    assert('You must set a _type property on the map component.', typeof this._type !== 'undefined');

    this._registrationType = this._pluralType || `${this._type}s`;

    this.isInitialized = defer();

    /**
     * An array of bound event listeners. Call `remove` on each before
     * destroying the component.
     */
    this._eventListeners = new Map();

    this.publicAPI = new PublicAPI(this, MapComponentAPI);
  },

  didInsertElement() {
    this._super(...arguments);

    this._internalAPI._registerComponent(this._registrationType, this.publicAPI);

    this._updateOrAddComponent();
  },

  didUpdateAttrs() {
    this._updateOrAddComponent();
  },

  willDestroyElement() {
    this._super(...arguments);

    this._eventListeners.forEach((remove) => remove());

    tryInvoke(this.mapComponent, 'setMap', [null]);

    this.publicAPI.remove(this);

    this._internalAPI._unregisterComponent(this._registrationType, this.publicAPI);
  },


  _updateOrAddComponent() {
    let options, events;

    switch (this.mapComponentLifecycle) {
      case READY:
        options = this._createOptions(get(this, '_options'));
        events = this._createEvents(get(this, '_events'));

        this._updateComponent(this.mapComponent, options, events);
        break;

      case IN_PROGRESS:
        break; // PASS

      case NOT_READY:
        if (typeof this.map === 'undefined') { break; }

        this.mapComponentLifecycle = IN_PROGRESS;

        options = this._createOptions(get(this, '_options'));
        events = this._createEvents(get(this, '_events'));

        resolve()
          .then(() => this._addComponent(options, events))
          .then(mapComponent => this._didAddComponent(mapComponent, options, events))
          .then(() => {
            this.isInitialized.resolve();
            this.mapComponentLifecycle = READY;
          })
          .catch(() => { this.mapComponentLifecycle = NOT_READY; });

        break;
    }
  },


  /* Map component hooks */

  /**
   * Run when the map component is first initialized. Normally this happens as
   * soon as the map is ready.
   *
   * @method _addComponent
   * @return
   */
  _addComponent(/* options, events */) {
    assert('Map components must implement the _addComponent hook.');
    return reject();
  },

  /**
   * Run after the map component has been initialized. This hook should be used
   * to register events, etc.
   *
   * @method _didAddComponent
   * @return
   */
  _didAddComponent(mapComponent, options, events) {
    let payload = {
      map: this.map,
      publicAPI: this.publicAPI,
    };

    addEventListeners(mapComponent, events, payload)
      .forEach(({ name, remove }) => this._eventListeners.set(name, remove));

    return resolve();
  },

  /**
   * Run when any of the attributes or watched options change.
   *
   * @method _updateComponent
   * @return
   */
  _updateComponent(mapComponent, options /* , events */) {
    mapComponent.setOptions(options);
  }
});

export { MapComponent as default, MapComponentLifecycleEnum };
