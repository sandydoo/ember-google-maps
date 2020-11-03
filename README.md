# Ember Google Maps

A friendly [Ember][ember-url] addon for working with [Google Maps][google-maps-url].

[![Version][npm-version-badge]][npm-url]
[![npm][npm-downloads-badge]][npm-url]
[![Ember Observer Score][ember-observer-badge]][ember-observer-url]
[![Build Status][ci-badge]][ci-url]

##### What this addon *is*:

* ✅  A lightweight Ember API for working with Google Maps.
* ✅  An on-demand, asynchronous loader for the Google Maps API.

##### What this addon *is not*:

* ❌  A bulky, verbose wrapper that reimplements the entire Google Maps API.
* ❌  An option validator that is tightly coupled to Google's API.


📎 Documentation
--------------------------------------------------------------------------------

**[View guide and documentation ↗️][docs-url]**


🔗 Compatibility
--------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v3.11 or above
* Node.js v10 or above


⭐ Features
--------------------------------------------------------------------------------


| Feature                   |                   |
| :------------------------ | :---------------: |
| Lightweight wrapper       | ✅                |
| Async API loading         | ✅                |
| Official Google API       | ✅                |
| Leverages templates       | ✅                |
| Contextual components     | ✅                |
| Minimal observer usage    | ✅                |
| Native Ember HTML markers | ✅                |

If you don't need the Google API specifically, check out [ember-leaflet ↗️](https://github.com/miguelcobain/ember-leaflet).


Examples of what to expect
--------------------------------------------------------------------------------

Display a map centered around a set of coordinates 🗺.

```handlebars
{{g-map lat='51.508530' lng='-0.076132' zoom=10}}
```

Display an array of locations using markers 📍.

```handlebars
{{#g-map lat='51.508530' lng='-0.076132' zoom=10 as |g|}}
  {{#each locations as |l|}}
    {{g.marker lat=l.lat lng=l.lng onClick=(action 'showDetails' l)}}
  {{/each}}
{{/g-map}}
```

Display a custom overlay, like a custom HTML marker using template blocks 😱.
This lets you do all sorts of fancy things, like adding CSS animations and binding data.

```handlebars
{{#g-map lat='51.508530' lng='-0.076132' zoom=10 as |g|}}
  {{#each rentals as |r|}}
    {{#g.overlay lat=r.lat lng=r.lng classNames='custom-marker'}}
      <div class="marker-content">
        <p class="price">{{r.price}}</p>
      </div>
    {{/g.overlay}}
  {{/each}}
{{/g-map}}
```

**[Learn more ↗️][docs-url]**


👷 Maintainers
--------------------------------------------------------------------------------

This addon is maintained by **[Sander Melnikov][maintainer-url]**.


Contributing
--------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).


License
--------------------------------------------------------------------------------

[MIT][license-url] © [Sander Melnikov][maintainer-url].


Disclaimer
--------------------------------------------------------------------------------

This software and its maintainer are in no way affiliated, endorsed, maintained, or supported by Google LLC.

©2020 Google LLC All rights reserved. Google Maps™ is a trademark of Google LLC.


[npm-version-badge]: https://img.shields.io/npm/v/ember-google-maps.svg
[npm-downloads-badge]: https://img.shields.io/npm/dm/ember-google-maps
[npm-url]: https://www.npmjs.org/package/ember-google-maps

[ci-badge]: https://github.com/sandydoo/ember-google-maps/workflows/CI/badge.svg
[ci-url]: https://github.com/sandydoo/ember-google-maps/actions?query=workflow%3ACI

[ember-observer-badge]: https://emberobserver.com/badges/ember-google-maps.svg
[ember-observer-url]: https://emberobserver.com/addons/ember-google-maps

[ember-url]: https://emberjs.com
[google-maps-url]: https://developers.google.com/maps/documentation/javascript/overview

[docs-url]: https://ember-google-maps.sandydoo.me/
[maintainer-url]: https://github.com/sandydoo
[license-url]: https://github.com/sandydoo/ember-google-maps/blob/main/LICENSE.md
