import Route from '@ember/routing/route';

export default class DocsRoute extends Route {
  beforeModel() {
    this.replaceWith('docs.getting-started');
  }
}
