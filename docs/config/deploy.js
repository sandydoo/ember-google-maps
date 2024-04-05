'use strict';

module.exports = function (deployTarget) {
  let ENV = {
    build: {},
    // include other plugin configuration that applies to all deploy targets here
    pipeline: {
      activateOnDeploy: true,
    },
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here

    ENV.s3 = {
      bucket: 'ember-google-maps.sandydoo.me',
      region: 'eu-west-1',
      filePattern:
        '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,html}',
    };

    ENV['s3-index'] = {
      bucket: 'ember-google-maps.sandydoo.me',
      region: 'eu-west-1',
    };
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
