import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class extends Controller {
  @action
  onLoad({ map, components }) {
    // Do something with the map
  }
}
