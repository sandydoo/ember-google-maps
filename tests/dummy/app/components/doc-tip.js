import Component from '@ember/component';
import layout from '../templates/components/doc-tip';

export default Component.extend({
  layout,
  tagName: '',

  cardClassNames: 'doc-tip',

  badgeClassNames: 'badge-primary',
  badgeText: 'Tip'
});
