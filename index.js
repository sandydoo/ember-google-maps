/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-google-maps',

  config(env, config) {
    let src = '//maps.googleapis.com/maps/api/js';
    let mapConfig = config['ember-google-maps'] || {};
    let params = [];

    let key = mapConfig.key;
    if (key) {
      params.push('key=' + encodeURIComponent(key));
    }

    let version = mapConfig.version;
    if (version) {
      params.push('v=' + encodeURIComponent(version));
    }

    let client = mapConfig.client;
    if (client) {
      params.push('client=' + encodeURIComponent(client));
    }

    let channel = mapConfig.channel;
    if (channel) {
      params.push('channel=' + encodeURIComponent(channel));
    }

    let libraries = mapConfig.libraries;
    if (libraries && libraries.length) {
      params.push('libraries=' + encodeURIComponent(libraries.join(',')));
    }

    let language = mapConfig.language;
    if (language) {
      params.push('language=' + encodeURIComponent(language));
    }

    let protocol = mapConfig.protocol;
    if (protocol) {
      src = protocol + ':' + src;
    }

    src += '?' + params.join('&');

    mapConfig['src'] = src;

    config['ember-google-maps'] = mapConfig;

    return config;
  }
};
