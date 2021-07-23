import Route from '@ember/routing/route';

export default class NotFoundRoute extends Route {
  beforeModel() {
    this.transitionTo('docs.getting-started');
  }
}
