'use strict';

const browsers = [
  'last 1 Chrome versions',
  'last 1 Firefox versions',
  'last 1 Safari versions'
];

const isCI = Boolean(process.env.CI);

if (isCI) {
  browsers.push('ie 11');
}

module.exports = {
  browsers
};
