import Base from './base';
import layout from '../../templates/components/g-map/control';
import { get, set } from '@ember/object';

export default Base.extend({
  layout,

  tagName: 'div',
  _type: 'control',

  _requiredOptions: ['position'],

  _addComponent() {
    const _targetPane = set(this, '_targetPane', document.createElement('div'));
    const map = get(this, 'map');
    const controlPosition = google.maps.ControlPosition[get(this, 'position')];
    map.controls[controlPosition].push(_targetPane);
    set(this, 'mapComponent', _targetPane);
    this._didAddComponent();
  }
});
