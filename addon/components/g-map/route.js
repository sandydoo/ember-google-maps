import MapComponent from './map-component';

export default class Route extends MapComponent {
  newOptions(options) {
    if (!options.directions || options.directions?.status !== 'OK') {
      return {};
    }

    return options;
  }

  new(options, events) {
    let route = new google.maps.DirectionsRenderer(options);

    this.addEventsToMapComponent(route, events, this.publicAPI);

    return route;
  }

  update(route) {
    route.setMap(this.context.map);

    this.updateCommon(...arguments);

    return route;
  }
}
