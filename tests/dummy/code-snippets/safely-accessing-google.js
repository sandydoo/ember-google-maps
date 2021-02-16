import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default class extends Controller {
  @service
  googleMapsApi;

  @reads('googleMapsApi.google')
  google;
}
