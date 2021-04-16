import MapComponent from './map-component';

export default class Polyline extends MapComponent {
  get name() {
    return 'polylines';
  }

  new(options, events) {
    let polyline = new google.maps.Polyline(options);

    this.addEventsToMapComponent(polyline, events, this.publicAPI);

    polyline.setMap(this.context.map);

    return polyline;
  }

  update(...args) {
    return super.updateCommon(...args);
  }
}
