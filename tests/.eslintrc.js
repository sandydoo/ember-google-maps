module.exports = {
  env: {
    embertest: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'simplabs/configs/ember-qunit',
    'simplabs/plugins/qunit'
  ]
};
