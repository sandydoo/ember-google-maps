import MapComponent from './map-component';
import { tracked } from '@glimmer/tracking';
import { toLatLng } from '../../utils/helpers';

export default class InfoWindow extends MapComponent {
  get name() {
    return 'infoWindows';
  }

  get isOpen() {
    return Boolean(this.infoWindow.getMap());
  }

  // TODO: Sanitize this.args.content?
  get content() {
    return this.args.content ?? this.container;
  }

  // Can’t use a fragment here because Google Maps consumes it.
  @tracked
  container = window?.document?.createElement('div');

  get newOptions() {
    let options = this.options;

    if (!options.target && !this.args.position) {
      options.position = toLatLng(this.args.lat, this.args.lng);
    }

    if (options.isOpen) {
      options.content = this.content;
    }

    return options;
  }

  setup() {
    let infoWindow = new google.maps.InfoWindow(this.newOptions);

    // This is kind of annoying. Maybe we can refactor stuff to not use `this`.
    this.infoWindow = infoWindow;

    this.addEventsToMapComponent(infoWindow, this.events, this.publicAPI);

    this.toggleOpen();

    return infoWindow;
  }

  update(infoWindow) {
    infoWindow.setOptions(this.newOptions);

    this.toggleOpen();
  }

  toggleOpen() {
    let shouldBeOpen = this.args.isOpen ?? false;

    if (shouldBeOpen === this.isOpen) {
      return;
    }

    if (shouldBeOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    this.infoWindow.open(this.map, this.options.target);
  }

  close() {
    this.infoWindow.close();
  }
}
