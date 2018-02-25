import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  document: service('-document'),

  actions: {
    didTransition() {
      this.get('document').body.setAttribute('class', 'white');
    },

    willTransition() {
      this.get('document').body.setAttribute('class', '');
    }
  }
});
