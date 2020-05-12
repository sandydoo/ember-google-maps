import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class extends Controller {
  london = {
    lat: 51.507568,
    lng: -0.127762
  };

  @action
  recenterMap(map) {
    let { lat, lng } = this.london;
    map.setZoom(12);
    map.panTo({ lat, lng });
  }
}