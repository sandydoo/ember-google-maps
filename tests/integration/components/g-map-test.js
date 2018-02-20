import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('g-map', 'Integration | Component | g map', {
  integration: true
});

test('it asserts that both lat and lng are provided', function(assert) {
  assert.expectAssertion(() => {
    this.render(hbs`{{g-map}}`);
  }, 'You must provide both lat and lng');
});
