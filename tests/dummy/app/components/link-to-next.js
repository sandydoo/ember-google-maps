import LinkComponent from '@ember/routing/link-component';
import { get, set } from '@ember/object';

const linkToNext = LinkComponent.extend({
  classNames: ['btn', 'btn-primary'],

  init() {
    this._super(...arguments);
    const nextPage = get(this, 'nextPage');
    set(this, 'params', [
      `${nextPage.title} ›`,
      nextPage.path
    ]);
  }
});

linkToNext.reopenClass({
  positionalParams: ['nextPage']
});

export default linkToNext;
