import TypicalMapComponent from './typical-map-component';

export default class Route extends TypicalMapComponent {
  get name() {
    return 'routes';
  }

  get newOptions() {
    if (this.options.directions?.status !== 'OK') {
      return {};
    }

    return this.options;
  }

  fresh(options = {}) {
    return new google.maps.DirectionsRenderer(options);
  }
}
