import Service from '@ember/service';
import { Promise, reject, resolve } from 'rsvp';
import { getOwner } from '@ember/application';
import { bind } from '@ember/runloop';
import { assert } from '@ember/debug';
import { waitFor } from '@ember/test-waiters';

import { getAsync } from '../utils/async-data';

export default class GoogleMapsApiService extends Service {
  @getAsync
  get google() {
    return this._getApi();
  }

  @getAsync
  get directionsService() {
    return this.google.then((google) => new google.maps.DirectionsService());
  }

  /**
   * By default, this returns the config created at build time. You can
   * use this hook to override some of the config that's used to build the URL at runtime instead.
   *
   * Optionally, you can return a promise that resolves with the overriden config. This
   * allows you to use external data when building the URL. For example, you
   * could fetch the database record for the current user for localisation
   * purposes.
   */
  overrideConfig(config) {
    return config;
  }

  /**
   * Get the configuration for ember-google-maps set in environment.js. This
   * should contain your API key and any other options you set.
   */
  _getConfig() {
    return getOwner(this).resolveRegistration('config:environment')[
      'ember-google-maps'
    ];
  }

  /**
   * Return or load the Google Maps API.
   */
  @waitFor
  _getApi() {
    if (typeof document === 'undefined') {
      return reject();
    }

    if (window?.google?.maps) {
      return resolve(window.google);
    }

    let config = this._getConfig();

    return resolve(config).then(this.overrideConfig).then(this._loadAndInitApi);
  }

  _loadAndInitApi(config) {
    let { channel, key, language, libraries, region, version, mapIds } = config;

    assert(
      `need to specify the API key? \
Learn more: https://ember-google-maps.sandydoo.me/docs/getting-started`,
      key,
    );

    return new Promise((resolve, reject) => {
      window.initGoogleMap = bind(async () => {
        if (libraries && libraries.length > 0) {
          for (let library of libraries) {
            await google.maps.importLibrary(library);
          }
        }
        resolve(window.google);
      });

      let versionString = version ? `version: "${version}",` : '';
      let channelString = channel ? `channel: "${channel}",` : '';
      let regionString = region ? `region: "${region}",` : '';
      let languageString = language ? `language: "${language}",` : '';
      let mapIdsString = mapIds ? `mapIds: ${mapIds},` : '';

      let s = document.createElement('script');
      s.type = 'text/javascript';
      s.textContent =
        `(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
          key: "${key}",` +
        versionString +
        `
            ` +
        channelString +
        `
            ` +
        regionString +
        `
            ` +
        languageString +
        `
            ` +
        mapIdsString +
        `
          // Add other bootstrap parameters as needed, using camel case.
        });
        initGoogleMap();
      `;
      s.onerror = (error) => reject(error);
      // Insert into DOM to avoid CORS problems
      document.body.appendChild(s);
    });
  }
}
