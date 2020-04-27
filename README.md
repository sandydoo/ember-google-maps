[![Build Status](https://travis-ci.org/sandydoo/ember-google-maps.svg?branch=master)](https://travis-ci.org/sandydoo/ember-google-maps)

📍 Ember Google Maps
------------------------------------------------------------------------------

> A *lightweight*, *declarative*, *composable* API for building ambitious map UIs in your Ember apps.

##### What this addon *is*:

* ✅  A lightweight Ember API for working with Google Maps.
* ✅  An on-demand, asynchronous loader for the Google Maps API.

##### What this addon *is not*:

* ❌  A bulky, verbose wrapper that reimplements the entire Google Maps API.
* ❌  A whitelist or option validator that is tightly coupled to Google's API.

📎 Documentation
------------------------------------------------------------------------------

#### [View guides and documentation ›](https://ember-google-maps.sandydoo.me/)

🔗 Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v3.11 or above
* Node.js v8 or above

👷‍ Maintainers
------------------------------------------------------------------------------

This addon is maintained by **[Sander Melnikov](https://github.com/sandydoo)**.

⭐ Features
------------------------------------------------------------------------------


| Feature                   |                   |
| :------------------------ | :---------------: |
| Lightweight wrapper       | ✅                |
| Async API loading         | ✅                |
| Official Google API       | ✅                |
| Leverages templates       | ✅                |
| Contextual components     | ✅                |
| Minimal observer usage    | ✅                |
| Native Ember HTML markers | ✅                |

If you don't need the Google API specifically, check out [ember-leaflet](https://github.com/miguelcobain/ember-leaflet).

Examples of what to expect
------------------------------------------------------------------------------

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

#### [Learn more ›](https://ember-google-maps.sandydoo.me/)

Contributing
------------------------------------------------------------------------------

#### Installation

* `git clone https://github.com/sandydoo/ember-google-maps.git` this repository
* `cd ember-google-maps`
* `yarn`

#### Linting

* `yarn lint:js`
* `yarn lint:js --fix `

#### Setting up API keys

The dummy app and test suite is run using a live map instance, which means you need an API key. I do not provide API keys for testing – you need to generate your own.

You can create an API key by following the instructions here: [Create API key](https://developers.google.com/maps/documentation/javascript/get-api-key).

Assign this key to the `GOOGLE_MAPS_API_KEY` variable in `.env` or just run these lines, making sure to replace `INSERT_YOUR_KEY_HERE` with your actual key.

`touch .env & echo 'GOOGLE_MAPS_API_KEY=<INSERT_YOUR_KEY_HERE>' > .env`
`cp .env .env.test`

#### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions


#### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).


#### Debugging the build process

This addon modifies the components included in the final build. You can store incremental build trees to debug the build process with the following command.

* `rm -rf DEBUG; BROCCOLI_DEBUG=ember-google-maps:* ember s`

This will create a `DEBUG` folder at the root of the project containing the source files at various stages of processing.
The `with-addon-factory` and `post-filter` trees should likely be investigated first.


For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

[MIT](https://github.com/sandydoo/ember-google-maps/blob/master/LICENSE.md) © [Sander Melnikov](https://github.com/sandydoo).
