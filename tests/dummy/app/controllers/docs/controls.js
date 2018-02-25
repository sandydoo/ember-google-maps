import DocsController from '../docs';
import CommonMapData from '../../mixins/common-map-data';

export default DocsController.extend(CommonMapData, {
  actions: {
    recenterMap(map) {
      const { lat, lng } = this.london;
      map.setZoom(12);
      map.panTo({ lat, lng });
    }
  }
});
