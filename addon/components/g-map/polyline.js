import Base from './base';
import { get, set } from '@ember/object';

export default Base.extend({
  _type: 'polyline',
  _requiredOptions: ['path'],
  _watchedOptions: ['path.[]'],

  _addComponent() {
    set(this, 'mapComponent', new google.maps.Polyline(get(this, '_options')));
    this._didAddComponent();
  }
});
