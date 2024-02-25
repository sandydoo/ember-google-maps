 import DocsController from '../docs';
 import { tracked } from '@glimmer/tracking';
 import { action } from '@ember/object';

export default class DocsTransitLayersController extends DocsController {
   queryParams = ['layer'];

   @tracked layer = 'traffic';

   @action
   switchLayer(newLayer) {
     this.layer = newLayer;
   }

   get codeSnippet() {
     return `basic-${this.layer}-layer.hbs`;
   }

   get isTrafficLayer() {
     return this.layer === 'traffic';
   }

   get isTransitLayer() {
     return this.layer === 'transit';
   }

   get isBicyclingLayer() {
     return this.layer === 'bicycling';
   }
 }
