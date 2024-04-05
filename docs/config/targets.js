'use strict';

const isProduction = process.env.EMBER_ENV === 'production';

const devTargets = [
  'last 1 Chrome versions',
  'last 1 Firefox versions',
  'last 1 Safari versions',
];

const prodTargets = ['defaults', 'not IE 11'];

const browsers = isProduction ? prodTargets : devTargets;

module.exports = {
  browsers,
};
