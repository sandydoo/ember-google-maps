import Marker from './marker';
import { get, set } from '@ember/object';
import { reads } from '@ember/object/computed';

/**
 * Circle marker component.
 *
 * @class
 * @extends Base
 */
export default Marker.extend({
  _type: 'circle',
  _requiredOptions: ['center', 'radius'],

  radius: 500,

  center: reads('position'),

  _addComponent() {
    set(this, 'mapComponent', new google.maps.Circle(get(this, '_options')));
    this._didAddComponent();
  }
});
