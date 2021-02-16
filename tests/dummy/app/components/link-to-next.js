import LinkComponent from '@ember/routing/link-component';
import { set } from '@ember/object';

const linkToNext = LinkComponent.extend({
  classNames: ['btn', 'btn-primary'],

  init() {
    this._super(...arguments);

    set(this, 'params', [
      `${this.nextPage.title} ›`,
      this.nextPage.path
    ]);
  }
});

linkToNext.reopenClass({
  positionalParams: ['nextPage']
});

export default linkToNext;
