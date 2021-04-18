import { helper } from '@ember/component/helper';

export default helper(function gMapAssign([obj], { key, value }) {
  obj[key] = value;
});
