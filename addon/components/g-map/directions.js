import MapComponent from './map-component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { Promise, reject } from 'rsvp';
import { schedule } from '@ember/runloop';
import { didCancel, keepLatestTask } from 'ember-concurrency';
import { TrackedSet } from 'tracked-maps-and-sets';
import { waitFor } from '@ember/test-waiters';

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

export default class Directions extends MapComponent {
  get name() {
    return 'directions';
  }

  get publicAPI() {
    return DirectionsAPI(this);
  }

  @tracked directions = null;

  @service googleMapsApi;

  waypointComponents = new TrackedSet();

  get waypoints() {
    return [...(this.options.waypoints ?? []), ...this.serializedWaypoints];
  }

  get serializedWaypoints() {
    return Array.from(this.waypointComponents.values()).map((waypoint) => {
      return {
        location: waypoint.location,
        stopover: waypoint.stopover,
      };
    });
  }

  get newOptions() {
    // Force options
    return {
      ...this.options,
      waypoints: this.waypoints,
    };
  }

  new() {
    this.directions = null;

    return this.route(this.newOptions)
      .then((directions) => {
        this.directions = directions;

        this.events.onDirectionsChanged?.(this.publicAPI);
      })
      .catch((e) => {
        if (!didCancel(e)) {
          return reject(e);
        }
      });
  }

  @waitFor
  route(options) {
    return this.fetchDirections.perform(options);
  }

  @keepLatestTask
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

    let directions = yield request;

    return directions;
  }

  @action
  getWaypoint(waypoint) {
    this.waypointComponents.add(waypoint);

    return () => this.removeWaypoint(waypoint);
  }

  removeWaypoint(waypoint) {
    this.waypointComponents.delete(waypoint);
  }
}
