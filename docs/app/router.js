import EmberRouter from '@ember/routing/router';
import config from 'ember-google-maps-docs/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // this.route('docs', { path: '/*path' });

  this.route('index', { path: '/' });

  this.route('guide', function () {
    this.route('configure');
    this.route('map');
    this.route('events');
    this.route('components');
    this.route('canvas');
    this.route('markers');
    this.route('circles');
    this.route('polylines');
    this.route('info-windows');
    this.route('controls');
    this.route('directions');
    this.route('overlays');
    this.route('complex-ui');
    this.route('advanced');
  });

  this.route('reference', function () {});

  this.route('examples', function () {
    this.route('sweet-rentals');
  });
});
