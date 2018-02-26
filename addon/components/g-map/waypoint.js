import Component from '@ember/component';
import MapComponent from '../../mixins/map-component';
import { get } from '@ember/object';

export default Component.extend(MapComponent, {
  tagName: '',

  _requiredOptions: ['location'],
  _ignoreAttrs: ['_registerWaypoint', '_unregisterWaypoint'],

  didReceiveAttrs() {
    this._super(...arguments);
    this._registerWaypoint(get(this, '_options'));
  },

  willDestroyElement() {
    this._unregisterWaypoint(get(this, '_options'));
    this._super(...arguments);
  }
});
