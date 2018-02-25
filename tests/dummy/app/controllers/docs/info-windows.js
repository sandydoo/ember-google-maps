import DocsController from '../docs';
import CommonMapData from '../../mixins/common-map-data';

export default DocsController.extend(CommonMapData, {
  mapTooltipOpen: false,
  markerTooltipOpen: false
});
