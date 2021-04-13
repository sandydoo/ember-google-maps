import MapComponent from './map-component';

function WaypointAPI(source) {
  return {
    get location() {
      return source.options.location;
    },

    get stopover() {
      return source.options.stopover;
    },
  };
}

export default class Waypoint extends MapComponent {
  publicAPI = WaypointAPI(this);

  new() {
    return this.publicAPI;
  }

  // Removes the waypoint from the directions component.
  teardown() {
    this.onTeardown();
  }

  register() {
    this.onTeardown = this.args.getContext(this.publicAPI);
  }
}
