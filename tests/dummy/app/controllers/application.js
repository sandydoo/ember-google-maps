import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { throttle } from '@ember/runloop';

export default class ApplicationController extends Controller {
  @service
  mapData;

  @service
  flashMessages;

  london = this.mapData.london;
  lightStyle = this.mapData.lightStyle;

  @action
  flashMessage(message) {
    this.flashMessages.info(message);
  }

  @action
  flashMessageThrottle(message) {
    throttle(this, 'send', 'flashMessage', message, 300, true);
  }
}
