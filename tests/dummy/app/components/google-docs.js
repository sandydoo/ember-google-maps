import Component from '@glimmer/component';
import { capitalize } from '@ember/string';

let referenceUrl =
    'https://developers.google.com/maps/documentation/javascript/reference/',
  guideUrl = 'https://developers.google.com/maps/documentation/javascript/';

export default class GoogleDocs extends Component {
  get type() {
    return this.args.type ?? 'reference';
  }

  get baseUrl() {
    return this.type === 'reference' ? referenceUrl : guideUrl;
  }

  get displayType() {
    return capitalize(this.type);
  }

  get href() {
    return this.baseUrl + this.args.section;
  }
}
