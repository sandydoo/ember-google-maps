import MapComponent from './map-component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { Promise, reject } from 'rsvp';
import { schedule } from '@ember/runloop';
import { didCancel, keepLatestTask } from 'ember-concurrency';

export function DirectionsAPI(source) {
  return {
    get directions() {
      return source.directions;
    },

    get waypoints() {
      return source.waypoints;
    },
  }
}

export default class Directions extends MapComponent {
  publicAPI = DirectionsAPI(this);

  @tracked directions = null;

  @service googleMapsApi;

  get waypoints() {
    return [...(this.options.waypoints ?? []), ...this.waypointsAsOptions];
  }

  get newOptions() {
    return {
      ...this.options,
      waypoints: this.waypoints,
    };
  }

  // We need to explicitly track this, otherwise autotracking doesn’t work.
  // Seems like Ember arrays are still a bit special.
  @tracked waypointComponents = A([]);

  get waypointsAsOptions() {
    return this.waypointComponents.map((waypoint) => {
      return { location: waypoint.location };
    });
  }

  new(options) {
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
    schedule('actions', () => {
      this.waypointComponents.pushObject(waypoint);
    });

    return () => this.removeWaypoint(waypoint);
  }

  removeWaypoint(waypoint) {
    schedule('actions', () => {
      this.waypointComponents.removeObject(waypoint);
    });
  }
}
