import TypicalMapComponent from './typical-map-component';

export default class Polyline extends TypicalMapComponent {
  get name() {
    return 'polylines';
  }

  newMapComponent(options = {}) {
    return new google.maps.Polyline(options);
  }
}
