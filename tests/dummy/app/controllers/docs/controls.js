import DocsController from '../docs';
import { action } from '@ember/object';


export default class ControlsController extends DocsController {
  @action
  recenterMap(map) {
    let { lat, lng } = this.london;
    map.setZoom(12);
    map.panTo({ lat, lng });
  }
}
