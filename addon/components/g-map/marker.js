import MapComponent from './map-component';
import { toLatLng } from '../../utils/helpers';

export default class Marker extends MapComponent {
  newOptions(options) {
    let { lat, lng } = this.args;

    return {
      position: toLatLng(lat, lng),
      ...options,
    };
  }

  new(options, events) {
    let marker = new google.maps.Marker(options);

    this.addEventsToMapComponent(marker, events, this.publicAPI);

    marker.setMap(this.context.map);

    return marker;
  }

  update() {
    return this.updateCommon(...arguments);
  }
}
