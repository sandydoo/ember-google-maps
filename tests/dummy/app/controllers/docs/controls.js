import Controller from '@ember/controller';
import CommonMapData from '../../mixins/common-map-data';

export default Controller.extend(CommonMapData, {
  actions: {
    recenterMap(map) {
      const { lat, lng } = this.london;
      map.setZoom(12);
      map.panTo({ lat, lng });
    }
  }
});
