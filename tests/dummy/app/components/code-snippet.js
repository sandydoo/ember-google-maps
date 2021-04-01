import Component from '@ember/component';
import layout from '../templates/components/code-snippet';
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

export default Component.extend({
  layout,
  tagName: '',

  init() {
    this._super(...arguments);

    let { language, source } = getCodeSnippet(this.name);

    language = this.language || language;
    this.languageClass = `language-${language}`;

    let grammar = Prism.languages[language];
    let highlightedCode = Prism.highlight(source, grammar, language);

    this.code = htmlSafe(highlightedCode);
  },
});
