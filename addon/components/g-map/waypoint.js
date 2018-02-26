import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  didReceiveAttrs() {
    this._super(...arguments);
    const { location, stopover } = this;
    this._registerWaypoint({ location, stopover });
  }
});
