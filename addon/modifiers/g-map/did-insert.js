import { modifier } from 'ember-modifier';
import { assert } from '@ember/debug';

function gMapDidInsert(element, [callback, ...positional], named) {
  assert(
    '`g-map/did-insert` expects a function as its first positional argument.',
    typeof callback === 'function',
  );

  callback(element, positional, named);
}

export default modifier(gMapDidInsert, { eager: false });
