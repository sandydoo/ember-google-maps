import Marker from 'ember-google-maps/components/g-map/marker';

export default class CustomMarker extends Marker {
  get name() {
    return 'customMarkers';
  }
}
