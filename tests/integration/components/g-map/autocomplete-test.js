import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import GMapComponent from 'ember-google-maps/components/g-map';
import { london } from '../../../helpers/locations';
import { defer } from 'rsvp';
import { fillIn, findWithAssert } from 'ember-native-dom-helpers';
import { trigger } from '../../../helpers/g-map-helpers';

moduleForComponent('g-map/autocomplete', 'Integration | Component | g map/autocomplete', {
  integration: true,

  beforeEach() {
    this.setProperties(london);
    let mapPromise = defer();
    this.set('mapPromise', mapPromise);

    this.register('component:g-map', GMapComponent.extend({
      init() {
        this._super(...arguments);
        this.set('onComponentsLoad', (result) => mapPromise.resolve(result));
      }
    }));

    this.inject.service('googleMapsApi');
    return this.get('googleMapsApi')._loadMapsAPI();
  }
});

test('it renders a pac-input', async function(assert) {
  this.render(hbs`
    {{#g-map lat=lat lng=lng as |g|}}
      {{g.autocomplete}}
    {{/g-map}}
  `);

  let input = findWithAssert('input');
  assert.ok(input.id.startsWith('pac-input-'));
});

test('it calls an action on input', async function(assert) {
  this.on('onInput', (value) => assert.equal(value, 'test'));
  this.render(hbs`
    {{#g-map lat=lat lng=lng as |g|}}
      {{g.autocomplete onInput=(action 'onInput')}}
    {{/g-map}}
  `);

  await fillIn('input', 'test');
});

test('it returns place results on search', async function(assert) {
  this.on('onSearch', () => assert.ok(true, 'place'));
  this.render(hbs`
    {{#g-map lat=lat lng=lng as |g|}}
      {{g.autocomplete onSearch=(action 'onSearch')}}
    {{/g-map}}
  `);

  let { publicAPI } = await this.get('mapPromise.promise');
  // Fetch the initialized Autocomplete component and shim the getPlace
  // function.
  let autocomplete = publicAPI.autocompletes[0].mapComponent;
  autocomplete.getPlace = () => { return { geometry: true } };

  trigger(autocomplete, 'place_changed');
});
