import TypicalMapComponent from './typical-map-component';

export default class BicyclingLayer extends TypicalMapComponent {
  get name() {
    return 'bicyclingLayers';
  }

  newMapComponent(options = {}) {
    return new google.maps.BicyclingLayer(options);
  }
}
