import MapComponent from './g-map/map-component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A } from '@ember/array';

import { toLatLng } from '../utils/helpers';

import { waitFor } from '@ember/test-waiters';
import { DEBUG } from '@glimmer/env';

export default class GMap extends MapComponent {
  @tracked canvas;

  @tracked mapComponent;

  // TODO: Fix components for publicAPI
  components = A([]);

  get map() {
    return this.mapComponent;
  }

  newOptions(options) {
    let { lat, lng } = this.args;

    return {
      zoom: 15,
      center: toLatLng(lat, lng),
      ...options,
    };
  }

  // TODO: What if canvas is conditional? Render helpers? Promise? Force a
  // visible canvas?
  // TODO: Fix publicAPI
  new(options, events) {
    let map = new google.maps.Map(this.canvas, options);

    this.addEventsToMapComponent(map, events, { map });

    return map;
  }

  update(map, options) {
    map.setOptions(options);

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

  // TODO: Return the publicAPI here
  @action
  getComponent(component) {
    this.components.pushObject(component);
    return this;
  }
}
