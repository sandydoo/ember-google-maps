import Controller from '@ember/controller';
import CommonMapData from '../../mixins/common-map-data';
import { computed } from '@ember/object';

export default Controller.extend(CommonMapData, {
  fillColor: 'green',

  radius: computed({
    get: () => 1000,
    set: (_k, v) => parseInt(v)
  })
});
