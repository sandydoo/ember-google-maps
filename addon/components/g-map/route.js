import MapComponent from './map-component';

export default class Route extends MapComponent {
  get newOptions() {
    if (this.options.directions?.status !== 'OK') {
      return {};
    }

    return this.options;
  }

  new(options, events) {
    let route = new google.maps.DirectionsRenderer(this.newOptions);

    this.addEventsToMapComponent(route, events, this.publicAPI);

    return route;
  }

  update(route) {
    route.setMap(this.context.map);

    this.updateCommon(...arguments);

    return route;
  }
}
