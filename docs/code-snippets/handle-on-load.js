import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class extends Controller {
  @action
  onLoad({ map, publicAPI }) {
    // Do something. Save a copy of the map instance and publicAPI.
  }
}
