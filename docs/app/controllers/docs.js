import ApplicationController from './application';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { TrackedMap } from '@sandydoo/tracked-maps-and-sets';
import darkStyle from '../map-styles/dark';
import lightStyle from '../map-styles/light';

export default class DocsController extends ApplicationController {
  @tracked
  lat = this.london.lat;

  @tracked
  lng = this.london.lng;

  locations = new TrackedMap();

  constructor() {
    super(...arguments);

    this.google.then(() => {
      let locations = this.mapData.createLocations();

      locations.forEach((location) => {
        this.locations.set(location.id, location);
      });
    });
  }

  @service
  router;

  @service
  mapData;

  get google() {
    return this.mapData.google;
  }

  get routeName() {
    return this.router.currentRouteName;
  }

  london = this.mapData.london;

  primaryMapStyle = darkStyle;
  lightStyle = lightStyle;

  get currentPage() {
    return this.links.find((l) => l.path === this.routeName);
  }

  get nextPage() {
    let index = this.links.indexOf(this.currentPage);
    return this.links[++index];
  }

  links = [
    { title: 'Getting started', path: 'docs.getting-started' },
    {
      title: 'Map',
      path: 'docs.map',
      text: 'That’s it. You’re now ready to create a map.',
    },
    { title: 'Events', path: 'docs.events' },
    { title: 'Components', path: 'docs.components' },
    { title: 'Canvas', path: 'docs.canvas' },
    { title: 'Markers', path: 'docs.markers' },
    { title: 'Circles', path: 'docs.circles', text: 'On to circles!' },
    { title: 'Polylines', path: 'docs.polylines', text: 'Onto polylines!' },
    {
      title: 'Info windows',
      path: 'docs.info-windows',
      text: 'Let’s learn how to add info windows or tooltips to the map.',
    },
    {
      title: 'Controls',
      path: 'docs.controls',
      text: 'Next, let’s look at how we can modify the default map UI.',
    },
    {
      title: 'Directions',
      path: 'docs.directions',
      text: 'Let’s look at how to query and display routing information.',
    },
    { title: 'Transit layers',
      path: 'docs.transit-layers',
      text: '',
    },
    {
      title: 'Custom overlays',
      path: 'docs.overlays',
      text: 'It’s finally time to learn how to create custom HTML markers!',
    },
    {
      title: 'Complex UI',
      path: 'docs.complex-ui',
      text: 'Let’s see what we can build with these components.',
    },
    {
      title: 'Testing',
      path: 'docs.testing',
      text: 'Let’s learn how to test apps with maps.',
    },
    {
      title: 'Clustering',
      path: 'docs.clustering',
      text: 'Let’s see how we can efficiently deal with large numbers of markers using clustering.',
    },
    {
      title: 'Advanced',
      path: 'docs.advanced',
      text: 'Learn about some of the more advanced options of this addon.',
    },
  ];
}
