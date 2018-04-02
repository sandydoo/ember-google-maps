import Controller from '@ember/controller';

export default Controller.extend({
  actionBoundToMarker({ event }) {
    // Stop event propagation
    event.stopPropagation();

    // Do something
  }
});
