import { tracked } from '@glimmer/tracking';
import { setOwner } from '@ember/application';
import { setComponentManager } from '@ember/component';
import { assert } from '@ember/debug';

import { MapComponentManager } from '../../component-managers/map-component-manager';
import { addEventListeners } from 'ember-google-maps/utils/options-and-events';

export function combine(base, extra) {
  return Object.defineProperties(base, Object.getOwnPropertyDescriptors(extra));
}

export function MapComponentAPI(source) {
  return {
    get map() {
      return source.map;
    },

    get mapComponent() {
      return source.mapComponent;
    },
  };
}

export default class MapComponent {
  boundEvents = [];

  publicAPI = MapComponentAPI(this);

  get map() {
    return this.context.map;
  }

  constructor(owner, args, options, events) {
    setOwner(this, owner);

    this.args = args;
    this.options = options;
    this.events = events;

    this.register();
  }

  get newOptions() {
    return this.options;
  }

  new() {}

  updateCommon(mapComponent, options) {
    if (mapComponent) {
      mapComponent.setOptions?.(options);
    }

    return mapComponent;
  }

  teardown(mapComponent) {
    this.boundEvents.forEach(({ remove }) => remove());

    // Cleanup events by removing map.
    if (mapComponent) {
      mapComponent.setMap?.(null);
    }
  }

  register() {
    this.context = this.args.getContext?.(this.publicAPI);
  }

  // TODO: Fix event payload. Move map to publicAPI?
  get eventPayload() {
    return {
      map: this.context.map,
      publicAPI: this.publicAPI,
    };
  }

  addEventsToMapComponent(mapComponent, events = {}, payload = {}) {
    assert('You need to pass in a component', mapComponent);

    this.boundEvents = addEventListeners(mapComponent, events, payload);
  }

  // TODO: Fix in production, where names are uglified.
  toString() {
    return this.constructor.name;
  }
}

setComponentManager((owner) => new MapComponentManager(owner), MapComponent);
