import MapComponent from './map-component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Promise } from 'rsvp';
import { keepLatestTask } from 'ember-concurrency';
import { TrackedSet } from '@sandydoo/tracked-maps-and-sets';
import { waitFor } from '@ember/test-waiters';
import { untrack } from '../../effects/tracking';

export function DirectionsAPI(source) {
  return {
    get directions() {
      return source.directions;
    },

    get waypoints() {
      return source.waypoints;
    },
  };
}

// TODO should this yield something like `isRunning`? That way you can handle loading states.
export default class Directions extends MapComponent {
  @service googleMapsApi;

  get name() {
    return 'directions';
  }

  get publicAPI() {
    return DirectionsAPI(this);
  }

  @tracked directions = null;

  waypointComponents = new TrackedSet();

  get waypoints() {
    return [...(this.options.waypoints ?? []), ...this.serializedWaypoints];
  }

  get serializedWaypoints() {
    return Array.from(this.waypointComponents, ({ location, stopover }) => {
      return {
        location,
        stopover,
      };
    });
  }

  setup(options) {
    let newOptions = { ...options, waypoints: this.waypoints };

    // ember-concurrency tracks its internal properties, so it ends up
    // triggering the effect a second time once it resolves. I guess we could
    // "changeset" the options to avoid this, but there's more. Because it runs
    // in the same computation as this effect, you can't even check `isRunning`
    // without triggering an error from Glimmer. That's not particularly great,
    // and I guess the solution might have to happen upstream (scheduling or
    // track/untrack frames). Let's see what comes out of Glimmer's effect
    // system and revisit.
    return untrack(() => this.fetchDirections.perform(newOptions));
  }

  @keepLatestTask
  @waitFor
  *fetchDirections(options = {}) {
    let directionsService = yield this.googleMapsApi.directionsService;

    let request = new Promise((resolve, reject) => {
      directionsService.route(options, (response, status) => {
        if (status === 'OK') {
          resolve(response);
        } else {
          reject(status);
        }
      });
    });

    this.directions = yield request;
    this.events.onDirectionsChanged?.(this.publicAPI);

    return this.directions;
  }

  // Directions can just be restarted
  teardown() {}

  @action
  getWaypoint(waypoint) {
    this.waypointComponents.add(waypoint);
    return () => this.waypointComponents.delete(waypoint);
  }
}
