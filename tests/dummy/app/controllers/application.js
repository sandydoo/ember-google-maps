import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  london = {
    lat: '51.507568',
    lng: '-0.127762',
  };

  @tracked
  markerTooltipOpen = false;

  @action
  toggle(key, obj) {
    obj[key] = !obj[key];
  }
}
