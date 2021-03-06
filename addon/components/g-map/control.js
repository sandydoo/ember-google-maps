import MapComponent from './map-component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class Control extends MapComponent {
  id = `ember-google-maps-control-${guidFor(this)}`;

  @tracked
  container = window?.document?.createDocumentFragment();

  get name() {
    return 'controls';
  }

  setup(options) {
    // TODO: Support an existing control position
    let position = google.maps.ControlPosition[options.position];

    this.map.controls[position].push(this.controlElement);

    // Could use {{prop}} for this (from ember-prop-modifier)
    this.controlElement.index = options.index;

    return this.controlElement;
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
