import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import darkStyle from '../map-styles/dark';
import lightStyle from '../map-styles/light';
import { tracked } from '@glimmer/tracking';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class MapDataService extends Service {
  @service
  googleMapsApi;

  @reads('googleMapsApi.google')
  google;

  primaryMapStyle = darkStyle;
  lightStyle = lightStyle;

  london = {
    lat: 51.507568,
    lng: -0.127762,
  };

  @tracked
  londonLocations = [];

  constructor() {
    super(...arguments);

    this.google.then(() => {
      this.londonLocations = this.createLocations();
    });
  }

  createLocations(numLocations = 42) {
    let { lat, lng } = this.london,
      origin = new google.maps.LatLng(lat, lng);

    return Array(numLocations)
      .fill()
      .map((_e, i) => {
        let heading = randomInt(1, 360),
          distance = randomInt(100, 5000),
          price = randomInt(0, 2000),
          n = google.maps.geometry.spherical.computeOffset(
            origin,
            distance,
            heading
          ),
          type = randomInt(1, 5);

        return { id: i, lat: n.lat(), lng: n.lng(), price, type };
      });
  }
}
