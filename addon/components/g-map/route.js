import Base from './base';
import layout from '../../templates/components/g-map/route';
import { get, set } from '@ember/object';

/**
 * A wrapper for the google.maps.DirectionsRenderer class.
 *
 * @class Route
 * @namespace GMap
 * @module ember-google-maps/components/g-map/route
 * @extends GMap.Base
 */
export default Base.extend({
  layout,

  tagName: '',

  _type: 'route',

  _requiredOptions: ['directions'],

  didReceiveAttrs() {
    this._super(...arguments);

    if (!this._isInitialized && this.mapComponent && get(this, '_options.directions')) {
      this._didAddComponent();
    }
  },

  _addComponent() {
    const options = get(this, '_options');
    if (!options.directions) {
      delete options.directions;
    }
    set(this, 'mapComponent', new google.maps.DirectionsRenderer(options));
  }
});
