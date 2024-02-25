import TypicalMapComponent from './typical-map-component';

export default class TransitLayer extends TypicalMapComponent {
  get name() {
    return 'transitLayers';
  }

  newMapComponent(options = {}) {
    return new google.maps.TransitLayer(options);
  }
}
