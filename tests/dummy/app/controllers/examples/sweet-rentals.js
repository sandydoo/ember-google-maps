import Controller from '@ember/controller';
import CommonMapData from '../../mixins/common-map-data';
import { inject as service } from '@ember/service';
import { computed, get, getProperties, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { throttle } from '@ember/runloop';

export default Controller.extend(CommonMapData, {
  googleMapsApi: service(),

  google: reads('googleMapsApi.google'),

  boundedLondonLocations: computed('londonLocations', 'mapBounds', function() {
    let londonLocations = get(this, 'londonLocations');
    let mapBounds = get(this, 'mapBounds');

    return londonLocations.filter((location) => {
      if (mapBounds) {
        let { lat, lng } = getProperties(location, 'lat', 'lng');
        return mapBounds.contains(new google.maps.LatLng(lat, lng));
      } else {
        return true;
      }
    });
  }),

  actions: {
    saveBounds({ map }) {
      throttle(this, this._saveBounds, map, 30);
    },

    scrollToListing(listing) {
      let id = `rental-${listing.id}`;
      let el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },

  _saveBounds(map) {
    set(this, 'mapBounds', map.getBounds());
  }
});
