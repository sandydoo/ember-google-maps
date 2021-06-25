import TypicalMapComponent from './typical-map-component';

export default class Rectangle extends TypicalMapComponent {
  get name() {
    return 'rectangles';
  }

  newMapComponent(options = {}) {
    return new google.maps.Rectangle(options);
  }
}
