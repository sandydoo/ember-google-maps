import MapComponent from './g-map/map-component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import { toLatLng } from '../utils/helpers';

import { waitFor } from '@ember/test-waiters';
import { DEBUG } from '@glimmer/env';

function GMapPublicAPI(source) {
  return {
    get map() {
      return source.map;
    },

    get components() {
      return source.components;
    },
  };
}

export default class GMap extends MapComponent {
  @tracked canvas;

  components = {};

  get publicAPI() {
    return GMapPublicAPI(this);
  }

  get map() {
    return this.mapComponent;
  }

  get newOptions() {
    this.options.zoom ??= 15;
    this.options.center ??= toLatLng(this.args.lat, this.args.lng);

    return this.options;
  }

  // TODO: What if canvas is conditional? Render helpers? Promise? Force a
  // visible canvas?
  new(options, events) {
    let map = new google.maps.Map(this.canvas, this.newOptions);

    this.addEventsToMapComponent(map, events, this.publicAPI);

    google.maps.event.addListenerOnce(map, 'idle', () =>
      this.events.onLoad?.(this.publicAPI)
    );

    return map;
  }

  update(map) {
    map.setOptions(this.newOptions);

    // Pause tests until map is in an idle state.
    if (DEBUG) {
      this.pauseTestForIdle(map);
    }

    return map;
  }

  @waitFor
  async pauseTestForIdle(map) {
    await new Promise((resolve) => {
      google.maps.event.addListenerOnce(map, 'idle', () => resolve(map));
    });
  }

  @action
  getCanvas(canvas) {
    this.canvas = canvas;
  }

  // TODO: Return remove function
  @action
  getComponent(component, as = 'other') {
    let components = this.components[as] ?? [];

    components.push(component);

    this.components[as] ??= components;

    return this.publicAPI;
  }
}
