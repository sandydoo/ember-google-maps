import Component from '@ember/component';
import layout from '../templates/components/rental-card';
import { set } from '@ember/object';

export default Component.extend({
  layout,
  classNames: ['card rental-card'],
  classNameBindings: ['rental.active:active'],

  init() {
    this._super(...arguments);
    set(this, 'elementId', `rental-${this.rental.id}`);
  },

  mouseEnter() {
    set(this, 'rental.active', true);
  },

  mouseLeave() {
    set(this, 'rental.active', false);
  }
});
