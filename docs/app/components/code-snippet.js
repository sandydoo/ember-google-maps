import Component from '@glimmer/component';
import { getCodeSnippet } from 'ember-code-snippet';
import { htmlSafe } from '@ember/template';
import Prism from 'prismjs';

/* eslint-disable */
// Force ember-auto-import to import the components we need. Don't @ me.
import js from 'prismjs/components/prism-javascript';
import handlebars from 'prismjs/components/prism-handlebars';
import css from 'prismjs/components/prism-css';
import shellSession from 'prismjs/components/prism-shell-session';
import markupTemplate from 'prismjs/components/prism-markup-templating';
import nw from 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';
/* eslint-enable */

export default class CodeSnippet extends Component {
  get snippet() {
    return getCodeSnippet(this.args.name);
  }

  get language() {
    return this.args.language ?? this.snippet.language;
  }

  get languageClass() {
    return `language-${this.language}`;
  }

  get code() {
    let grammar = Prism.languages[this.language];
    let highlightedCode = Prism.highlight(
      this.snippet.source,
      grammar,
      this.language,
    );
    return htmlSafe(highlightedCode);
  }
}
