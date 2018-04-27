import DocsController from '../docs';
import CommonMapData from '../../mixins/common-map-data';
import { get } from '@ember/object';
import { A } from '@ember/array';

export default DocsController.extend(CommonMapData, {
  fillColor: 'orange',

  flightCoordinates: A([
    { lat: 51.56742722687343, lng: -0.25783538818359375 },
    { lat: 51.51917163898047, lng: -0.23586273193359375 },
    { lat: 51.46680134633284, lng: -0.09922027587890625 },
    { lat: 51.476892649684764, lng: -0.0006866455078125 },
    { lat: 51.500154286474746, lng: 0.05218505859375 }
  ]),

  actions: {
    appendPolyline({ googleEvent }) {
      let latLng = googleEvent.latLng;

      get(this, 'flightCoordinates').pushObject({
        lat: latLng.lat(),
        lng: latLng.lng()
      });
    }
  }
});
