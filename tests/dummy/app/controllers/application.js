import Controller from '@ember/controller';
import CommonMapData from '../mixins/common-map-data';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { throttle } from '@ember/runloop';

export default Controller.extend(CommonMapData, {
  flashMessages: service(),

  actions: {
    flashMessage(message) {
      get(this, 'flashMessages').info(message);
    },

    flashMessageThrottle(message) {
      throttle(this, 'send', 'flashMessage', message, 300, true);
    }
  }
});
