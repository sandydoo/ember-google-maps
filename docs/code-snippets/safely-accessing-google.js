import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class extends Controller {
  @service
  googleMapsApi;

  get google() {
    return this.googleMapsApi.google;
  }
}
