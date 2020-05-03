/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { computed, get } from '@ember/object';
import { reads } from '@ember/object/computed';
import darkStyle from '../map-styles/dark';
import lightStyle from '../map-styles/light';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Mixin.create({
  googleMapsApi: service(),

  google: reads('googleMapsApi.google'),

  primaryMapStyle: darkStyle,
  lightStyle,

  london: {
    lat: 51.507568,
    lng: -0.127762
  },

  googleLoaded: reads('googleMapsApi.google.isFulfilled'),

  londonLocations: computed('googleLoaded', function() {
    if (!get(this, 'googleLoaded')) { return []; }
    const { lat, lng } = get(this, 'london');
    const origin = new google.maps.LatLng(lat, lng);

    return Array(42).fill().map((_e, i) => {
      const heading = randomInt(1, 360);
      const distance = randomInt(100, 5000);
      const price = randomInt(0, 2000);
      let n = google.maps.geometry.spherical.computeOffset(origin, distance, heading);
      let type = randomInt(1, 5);
      return { id: i, lat: n.lat(), lng: n.lng(), price, type };
    });
  }),
});
