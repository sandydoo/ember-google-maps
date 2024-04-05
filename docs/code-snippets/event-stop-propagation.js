import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class extends Controller {
  @action
  actionBoundToMarker({ event }) {
    // Stop event propagation
    event.stopPropagation();

    // Do something
  }
}
