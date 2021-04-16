import Marker from './marker';
import { toLatLng } from '../../utils/helpers';

export default class Circle extends Marker {

  get newOptions() {
    this.options.radius ??= 500;
    this.options.center ??= toLatLng(this.args.lat, this.args.lng);

    return this.options;
  }

  new(options, events) {
    let circle = new google.maps.Circle(this.newOptions);

    this.addEventsToMapComponent(circle, events, this.publicAPI);

    circle.setMap(this.map);

    return circle;
  }
}
