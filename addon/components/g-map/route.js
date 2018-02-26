import Base from './base';
import layout from '../../templates/components/g-map/route';
import { get, set } from '@ember/object';

export default Base.extend({
  layout,

  tagName: '',

  _type: 'route',

  _requiredOptions: ['directions'],

  _addComponent() {
    const options = get(this, '_options');
    if (!options.directions) {
      delete options.directions
    }
    set(this, 'mapComponent', new google.maps.DirectionsRenderer(options));

    this._didAddComponent();
  }
});
