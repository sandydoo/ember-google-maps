import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('index', { path: '/' });

  this.route('docs', function() {
    this.route('about');
    this.route('map');
    this.route('markers');
    this.route('circles');
    this.route('polylines');
    this.route('controls');
    this.route('overlays');
    this.route('complex-ui');
  });

  this.route('examples', function() {
    this.route('sweet-rentals');
  });
});

export default Router;
