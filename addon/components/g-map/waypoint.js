import MapComponent from './map-component';

function WaypointAPI(source) {
  let { options } = source;

  return {
    get location() {
      return options.location;
    },

    get stopover() {
      return options.stopover;
    },
  };
}

export default class Waypoint extends MapComponent {
  get publicAPI() {
    return WaypointAPI(this);
  }

  register() {
    this.onTeardown = this.args.getContext(this.publicAPI);
  }

  setup() {
    return this.publicAPI;
  }

  // Removes the waypoint from the directions component.
  teardown() {
    this.onTeardown();
  }
}
