import { moduleForComponent, test } from 'ember-qunit';
import { london } from '../../../helpers/locations'
import hbs from 'htmlbars-inline-precompile';
import { find } from 'ember-native-dom-helpers';
import { defer } from 'rsvp';

moduleForComponent('g-map/canvas', 'Integration | Component | g map/canvas', {
  integration: true,

  beforeEach() {
    this.setProperties(london);
    this.set('mapPromise', defer());
    this.set('registerMap', (result) => this.get('mapPromise').resolve(result));

    this.inject.service('googleMapsApi');
    return this.get('googleMapsApi')._loadMapsAPI();
  }
});

test('it renders a canvas div', function(assert) {
  this.set('_internalAPI', { _registerCanvas: () => {} });

  this.render(hbs`{{g-map/canvas _internalAPI=_internalAPI}}`);
  assert.ok(find('.ember-google-map'));
});

