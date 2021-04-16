import MapComponent from './map-component';
import { toLatLng } from '../../utils/helpers';

export default class Marker extends MapComponent {
  get name() {
    return 'markers';
  }

  get newOptions() {
    this.options.position ??= toLatLng(this.args.lat, this.args.lng);

    return this.options;
  }

  new(options, events) {
    let marker = new google.maps.Marker(this.newOptions);

    this.addEventsToMapComponent(marker, events, this.publicAPI);

    marker.setMap(this.map);

    return marker;
  }

  update(...args) {
    return super.updateCommon(...args);
  }
}
