import Controller from '@ember/controller';

export default Controller.extend({
  london: {
    lat: 51.507568,
    lng: -0.127762
  },

  actions: {
    recenterMap(map) {
      const { lat, lng } = this.london;
      map.setZoom(12);
      map.panTo({ lat, lng });
    }
  }
});