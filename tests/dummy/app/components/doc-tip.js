import Component from '@glimmer/component';

export default class DocTip extends Component {
  defaultBadgeText = 'Tip';
  defaultCardClassNames = 'doc-tip';
  defaultBadgeClassNames = 'badge-primary';

  get cardClassNames() {
    return this.args.cardClassNames ?? this.defaultCardClassNames;
  }

  get badgeClassNames() {
    return this.args.badgeClassNames ?? this.defaultBadgeClassNames;
  }

  get badgeText() {
    return this.args.badgeText ?? this.defaultBadgeText;
  }
}
