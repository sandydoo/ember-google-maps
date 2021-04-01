import GMapComponent from 'ember-google-maps/components/g-map';

export default function setupMapTest(hooks) {
  hooks.beforeEach(function () {
    let initTask;

    // Make sure to wrap the init task with a `waitFor`, so that this value
    // is populated before we access it.
    Object.defineProperty(this, 'gMapAPI', {
      get: function () {
        return initTask.lastSuccessful.value;
      },
    });

    this.owner.register(
      'component:g-map',
      GMapComponent.extend({
        init() {
          this._super(...arguments);

          initTask = this._initMap;
        },
      })
    );
  });
}
