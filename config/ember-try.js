'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: 'ember-lts-3.16',
        npm: {
          devDependencies: {
            'ember-source': '~3.16.0',
          },
        },
      },
      {
        name: 'ember-lts-3.20',
        npm: {
          devDependencies: {
            'ember-source': '~3.20.5',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          dependencies: {
            'ember-auto-import': '^2.0.0',
          },
          devDependencies: {
            'ember-source': await getChannelURL('beta'),
            webpack: '^5.0.0',
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          dependencies: {
            'ember-auto-import': '^2.0.0',
          },
          devDependencies: {
            'ember-source': await getChannelURL('canary'),
            webpack: '^5.0.0',
          },
        },
      },
      {
        name: 'ember-default-with-jquery',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': true,
          }),
        },
        npm: {
          devDependencies: {
            '@ember/jquery': '^1.1.0',
          },
        },
      },
      {
        name: 'ember-classic',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'application-template-wrapper': true,
            'default-async-observers': false,
            'template-only-glimmer-components': false,
          }),
        },
        npm: {
          ember: {
            edition: 'classic',
          },
        },
      },
      embroiderSafe({
        npm: {
          dependencies: {
            'ember-auto-import': '^2.0.0',
          },
          devDependencies: {
            webpack: '^5.0.0',
          },
        },
      }),
      embroiderOptimized({
        npm: {
          dependencies: {
            'ember-auto-import': '^2.0.0',
          },
          devDependencies: {
            webpack: '^5.0.0',
          },
        },
      }),
    ],
  };
};
