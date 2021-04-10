import Marker from './marker';
import { toLatLng } from '../../utils/helpers';

export default class Circle extends Marker {
  newOptions(options) {
    let { lat, lng } = this.args;

    return {
      radius: 500,
      center: toLatLng(lat, lng),
      ...options,
    };
  }

  new(options, events) {
    let circle = new google.maps.Circle(options);

    this.addEventsToMapComponent(circle, events, this.publicAPI);

    circle.setMap(this.context.map);

    return circle;
  }
}
