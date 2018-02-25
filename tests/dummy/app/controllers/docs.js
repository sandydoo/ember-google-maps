import ApplicationController from './application';
import CommonMapData from '../mixins/common-map-data';
import { inject as service } from '@ember/service';
import { computed, get } from '@ember/object';
import { reads } from '@ember/object/computed';

export default ApplicationController.extend(CommonMapData, {
  router: service(),

  routeName: reads('router.currentRouteName'),

  links: computed(function() {
    return [
      { title: 'About', path: 'docs.about', text: '' },
      { title: 'Getting started', path: 'docs.getting-started' },
      { title: 'Map', path: 'docs.map', text: "That's it. You're now ready to create a map." },
      { title: 'Events', path: 'docs.events' },
      { title: 'Components', path: 'docs.components' },
      { title: 'Canvas', path: 'docs.canvas' },
      { title: 'Markers', path: 'docs.markers' },
      { title: 'Circles', path: 'docs.circles', text: 'On to circles!' },
      { title: 'Polylines', path: 'docs.polylines', text: 'Onto polylines!' },
      { title: 'Info windows', path: 'docs.info-windows', text: "Let's learn how to add info windows or tooltips to the map." },
      { title: 'Controls', path: 'docs.controls', text: "Next, let's look at how we can modify the default map UI." },
      { title: 'Custom overlays', path: 'docs.overlays', text: "Enough about the basic components. Give me those custom HTML markers!" },
      { title: 'Complex UI', path: 'docs.complex-ui' }
    ];
  }).readOnly(),

  currentPage: computed('routeName', function() {
    return get(this, 'links').find((l) => l.path === get(this, 'routeName'));
  }),

  nextPage: computed('links', 'currentPage', function() {
    const links = get(this, 'links');
    let index = links.indexOf(get(this, 'currentPage'));
    return links[++index];
  }),
});
