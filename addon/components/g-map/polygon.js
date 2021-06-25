import TypicalMapComponent from './typical-map-component';

export default class Polyline extends TypicalMapComponent {
  get name() {
    return 'polygons';
  }

  newMapComponent(options = {}) {
    return new google.maps.Polygon(options);
  }
}
