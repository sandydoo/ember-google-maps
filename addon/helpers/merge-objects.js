import { helper } from '@ember/component/helper';
import { assign } from '@ember/polyfills';

export function mergeObjects(params) {
  return assign(...params);
}

export default helper(mergeObjects);
