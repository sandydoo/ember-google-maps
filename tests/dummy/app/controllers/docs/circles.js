import DocsController from '../docs';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';


export default class CirclesController extends DocsController {
  @tracked
  radius = 1000;

  @tracked
  fillColor = '#00F900';

  @action
  updateRadius(event) {
    this.radius = event.target.valueAsNumber;
  }

  @action
  updateFillColor(event) {
    this.fillColor = event.target.value;
  }
}
