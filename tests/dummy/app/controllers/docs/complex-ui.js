import DocsController from '../docs';
import CommonMapData from '../../mixins/common-map-data';
import { computed, get, getProperties, set } from '@ember/object';
import { throttle } from '@ember/runloop';

export default DocsController.extend(CommonMapData, {
  boundedLondonLocations: computed('mapBounds', function() {
    let londonLocations = get(this, 'londonLocations');
    return londonLocations.filter((location) => {
      let mapBounds = get(this, 'mapBounds');
      return mapBounds && get(this, 'mapBounds').contains(new google.maps.LatLng(getProperties(location, 'lat', 'lng')));
    });
  }),

  actions: {
    saveBounds({ map }) {
      throttle(this, this._saveBounds, map, 100);
    },

    scrollToListing(listing) {
      const id = `rental-${listing.id}`;
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
