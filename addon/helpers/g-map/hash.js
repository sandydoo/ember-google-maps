import { helper } from '@ember/component/helper';

export default helper(function gMapHash(positional, named) {
  return { ...named };
});
