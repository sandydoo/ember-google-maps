import MapComponent from './map-component';

export default class Polyline extends MapComponent {
  new(options, events) {
    let polyline = new google.maps.Polyline(options);

    this.addEventsToMapComponent(polyline, events, this.publicAPI);

    polyline.setMap(this.context.map);

    return polyline;
  }

  update() {
    this.updateCommon(...arguments);
  }
}
