import Component from '@ember/component';
import layout from '../templates/components/google-docs';
import { computed, get } from '@ember/object';

const GoogleDocs =  Component.extend({
  layout,
  tagName: 'a',
  attributeBindings: ['href', 'rel', 'target'],

  baseUrl: 'https://developers.google.com/maps/documentation/javascript/reference#',
  rel: 'noopener',
  target: '_blank',

  href: computed(function() {
    return get(this, 'baseUrl') + get(this, 'section');
  })
});

GoogleDocs.reopenClass({
  positionalParams: ['section']
});

export default GoogleDocs;
