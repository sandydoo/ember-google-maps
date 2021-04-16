import MapComponent from './map-component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class Control extends MapComponent {
  id = 'ember-google-maps-control-' + guidFor(this);

  container = window?.document?.createDocumentFragment();

  get name() {
    return 'controls';
  }

  new(options) {
    // TODO: Support an existing control position
    let position = google.maps.ControlPosition[options.position];

    this.context.map.controls[position].push(this.container.firstElementChild);

    return this.container;
  }

  teardown() {
    this.container = null;
    this.controlElement = null;
  }

  @action
  getControl(element) {
    this.controlElement = element;
  }
}
