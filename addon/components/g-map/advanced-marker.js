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
    if (this.args.draggable) {
      this.options.gmpDraggable = this.args.draggable;
    }

    return this.options;
  }

  update(mapComponent) {
    super.update(mapComponent);
    mapComponent.position = this.newOptions.position;
    mapComponent.gmpDraggable = this.newOptions.gmpDraggable;
  }

  newMapComponent(options = {}) {
    return new google.maps.marker.AdvancedMarkerElement(options);
  }
}
