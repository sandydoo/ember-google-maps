import { helper } from '@ember/component/helper';

export function merge([...objects]) {
  return Object.assign({}, ...objects);
}

export default helper(merge);
