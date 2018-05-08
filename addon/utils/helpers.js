import { computed, getProperties } from '@ember/object';

let position = computed('lat', 'lng', function() {
  const { lat, lng } = getProperties(this, 'lat', 'lng');
  if (lat && lng) {
    return new google.maps.LatLng(lat, lng);
  }
});

export { position };
