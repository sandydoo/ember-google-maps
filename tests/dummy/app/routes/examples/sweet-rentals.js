import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    didTransition() {

      document.body.classList.add('white');
    },

    willTransition() {
      document.body.classList.remove('white');
    }
  }
});
