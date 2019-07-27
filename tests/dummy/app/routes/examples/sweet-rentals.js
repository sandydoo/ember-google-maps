import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  document: service('-document'),

  init() {
    this._super(...arguments);

    this.on('routeWillChange', function() {
      this.get('document').body.setAttribute('class', '');
    });

    this.on('routeDidChange', function() {
      this.get('document').body.setAttribute('class', 'white');
    });
  }
});
