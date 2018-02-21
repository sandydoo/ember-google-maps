import Component from '@ember/component';
import layout from '../templates/components/header-main';

export default Component.extend({
  layout,

  links: [
    { title: 'About', path: 'docs.about' },
    { title: 'Getting started', path: 'docs.getting-started' },
    { title: 'Map', path: 'docs.map' },
    { title: 'Markers', path: 'docs.markers' },
    { title: 'Circles', path: 'docs.circles' },
    { title: 'Polylines', path: 'docs.polylines' },
    { title: 'Controls', path: 'docs.controls' },
    { title: 'Custom overlays', path: 'docs.overlays' },
    { title: 'Complex UI', path: 'docs.complex-ui' }
  ]
});
