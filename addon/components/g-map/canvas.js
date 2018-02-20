import Component from '@ember/component';

export default Component.extend({
  classNames: ['ember-google-map'],

  init() {
    this._super(...arguments);
    this._internalAPI._registerCanvas(this, this._isCustomCanvas);
  }
});
