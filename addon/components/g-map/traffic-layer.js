import TypicalMapComponent from './typical-map-component';

export default class Marker extends TypicalMapComponent {
  get name() {
    return 'traffic';
  }
  newMapComponent(options = {}) {
    return new google.maps.TrafficLayer(options);
  }
}
