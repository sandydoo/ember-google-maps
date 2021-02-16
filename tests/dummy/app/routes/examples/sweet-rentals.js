import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class extends Route {
  @service('-document')
  document;

  constructor() {
    super(...arguments);

    this.on('routeWillChange', function() {
      this.document.body.setAttribute('class', '');
    });

    this.on('routeDidChange', function() {
      this.document.body.setAttribute('class', 'white');
    });
  }
}
