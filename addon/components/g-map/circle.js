import Marker from './marker';
import { toLatLng } from '../../utils/helpers';

export default class Circle extends Marker {
  get name() {
    return 'circles';
  }

  get newOptions() {
    this.options.radius ??= 500;

    if (!this.args.center) {
      this.options.center = toLatLng(this.args.lat, this.args.lng);
    }

    return this.options;
  }

  newMapComponent(options = {}) {
    return new google.maps.Circle(options);
  }
}
