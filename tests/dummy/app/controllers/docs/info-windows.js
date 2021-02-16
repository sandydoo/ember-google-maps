import DocsController from '../docs';
import { tracked } from '@glimmer/tracking';


export default class InfoWindowsController extends DocsController {
  @tracked
  mapTooltipOpen = false;

  @tracked
  markerTooltipOpen =false;
}
