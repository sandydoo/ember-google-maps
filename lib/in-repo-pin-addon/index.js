/* eslint-env node */
'use strict';

module.exports = {
  name: 'in-repo-pin-addon',

  isEnabled() {
    let env = this.app.env;
    let projectName = this.app.project.pkg.name;

    if (env === 'test' && projectName === 'ember-google-maps') {
      return true;
    }

    return false;
  },
};
