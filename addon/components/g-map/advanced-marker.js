import TypicalMapComponent from './typical-map-component';
import { toLatLng } from '../../utils/helpers';

export default class AdvancedMarker extends TypicalMapComponent {
  get name() {
    return 'advanced-markers';
  }

  get newOptions() {
    if (!this.args.position) {
      this.options.position = toLatLng(this.args.lat, this.args.lng);
    }

    return this.options;
  }

  newMapComponent(options = {}) {
    return new google.maps.marker.AdvancedMarkerElement(options);
  }
}
