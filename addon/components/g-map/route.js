import MapComponent from './map-component';

export default class Route extends MapComponent {
  get name() {
    return 'routes';
  }

  get newOptions() {
    if (this.options.directions?.status !== 'OK') {
      return {};
    }

    return this.options;
  }

  new(options, events) {
    let route = new google.maps.DirectionsRenderer(this.newOptions);

    this.addEventsToMapComponent(route, events, this.publicAPI);

    route.setMap(this.map);

    return route;
  }

  update() {
    this.updateCommon(...arguments);
  }
}
