import { setOwner } from '@ember/application';
import { setComponentManager } from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';

import { MapComponentManager } from '../../component-managers/map-component-manager';
import { addEventListeners } from 'ember-google-maps/utils/options-and-events';

export function combine(base, extra) {
  return Object.defineProperties(base, Object.getOwnPropertyDescriptors(extra));
}

export function MapComponentAPI(source) {
  let name = source.name ?? 'unknown';

  return {
    get map() {
      return source.map;
    },

    get [name]() {
      return source.mapComponent;
    },

    get mapComponent() {
      return source.mapComponent;
    },
  };
}

export default class MapComponent {
  @tracked mapComponent;

  boundEvents = [];

  get publicAPI() {
    return MapComponentAPI(this);
  }

  get map() {
    return this.context?.map;
  }

  constructor(owner, args, options, events) {
    setOwner(this, owner);

    this.args = args;
    this.options = options;
    this.events = events;

    this.register();
  }

  setup() {}

  teardown(mapComponent) {
    this.boundEvents.forEach(({ remove }) => remove());

    // Cleanup events by removing map.
    if (mapComponent) {
      mapComponent.setMap?.(null);
    }

    // Unregister from the parent component
    this.onTeardown?.();
  }

  register() {
    if (typeof this.args.getContext === 'function') {
      let { context, remove } = this.args.getContext(this.publicAPI, this.name);
      this.context = context;
      this.onTeardown = remove;
    }
  }

  /* Events */

  addEventsToMapComponent(mapComponent, events = {}, payload = {}) {
    assert('You need to pass in a map component', mapComponent);

    let boundEvents = addEventListeners(mapComponent, events, payload);

    this.boundEvents.concat(boundEvents);
  }
}

setComponentManager((owner) => new MapComponentManager(owner), MapComponent);
