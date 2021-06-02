import MapComponent from './map-component';

export default class TypicalMapComponent extends MapComponent {
  get newOptions() {
    return this.options;
  }

  setup() {
    let mapComponent = this.newMapComponent(this.newOptions);

    this.addEventsToMapComponent(mapComponent, this.events, this.publicAPI);

    mapComponent.setMap(this.map);

    return mapComponent;
  }

  update(mapComponent) {
    mapComponent?.setOptions?.(this.newOptions);

    return mapComponent;
  }
}
