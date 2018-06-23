import { helper } from '@ember/component/helper';

// Same as ember-composable-helpers 'compute'.
export function gMapCompute([action, ...params]) {
  return action(...params);
}

export default helper(gMapCompute);
