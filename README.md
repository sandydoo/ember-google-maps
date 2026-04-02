> [!IMPORTANT]
> This project has been archived and is no longer maintained. \
> You're encouraged to fork and maintain your own version.
>
> Thank you to everyone who contributed over the years! We _almost_ made it to 10 years. \
> Most of the original Ember community has moved on to other things and so have I.
> I'm proud of the lasting positive impact we've had on the frontend ecosystem.
>
> See you around!
>
> — sandydoo

# Ember Google Maps

A friendly [Ember][ember-url] addon for working with [Google Maps][google-maps-url].

- Create and draw on your maps using Ember components.
- Automatically load the Google Maps API on demand and safely access it across your entire app.

<br>

- [Documentation](#-documentation)
  - [Quick start](#-quick-start-for-the-impatient)
- [Compatibility](#-compatibility)
- [Examples](#-examples)
- [Addons](#-extra-addons)
- [Maintainers](#-maintainers)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

Are you new to Ember? [Learn how to use Ember and install addons →](https://guides.emberjs.com/release/getting-started/quick-start/)

Looking for a more general mapping solution? [Check out ember-leaflet →](https://github.com/miguelcobain/ember-leaflet).

📎 Documentation
--------------------------------------------------------------------------------

**[Get started with ember-google-maps →][docs-url]**

### 💨 Quick start for the impatient

1. Install the addon.

```sh
ember install ember-google-maps
```

2. Provide a Google Maps API key in `config/environment.js`. [Learn how to create an API key →](https://developers.google.com/maps/documentation/javascript/get-api-key)

```js
'ember-google-maps': {
  key: "<GOOGLE_MAPS_API_KEY>"
}
```

3. Make sure your map has a size, or you’ll end up staring at a blank screen. `ember-google-map` is the default class for all maps.

```css
.ember-google-map {
  width: 500px;
  height: 500px;
}
```

4. Draw a new map at some coordinates.

```hbs
<GMap @lat="51.508530" @lng="-0.076132" />
```

5. Great! You’ve drawn a map.\
   **[Now keep reading the docs →][docs-url]**


🔗 Compatibility
--------------------------------------------------------------------------------

### [![Latest version][npm-version-badge]][npm-url]
  - Ember.js v3.28 or above
  - Ember CLI v3.28 or above
  - Node.js v18 or above


⭐ Examples
--------------------------------------------------------------------------------

Display a map centered around a set of coordinates.

```handlebars
<GMap @lat="51.508530" @lng="-0.076132" @zoom={{10}} />
```

Display an array of locations using markers 📍.

```handlebars
<GMap @lat="51.508530" @lng="-0.076132" @zoom={{10}} as |map|>
  {{#each this.locations as |location|}}
    <map.marker
      @lat={{location.lat}}
      @lng={{location.lng}}
      @onClick={{fn this.showDetails location}} />
  {{/each}}
</GMap>
```

Display a custom overlay, like a custom HTML marker using template blocks 😱.
This lets you do all sorts of fancy things, like adding CSS animations and binding data.

```handlebars
<GMap @lat="51.508530" @lng="-0.076132" @zoom={{10}} as |map|>
  {{#each this.rentals as |rental|}}
    <map.overlay @lat={{rental.lat}} @lng={{rental.lng}}>
      <div style="transform: translateX(-50%) translateY(-50%);">
        <p class="price">
          {{rental.price}}
        </p>
      </div>
    </map.overlay>
  {{/each}}
</GMap>
```

**[Learn more →][docs-url]**


🛒 Extra addons
--------------------------------------------------------------------------------

- [MarkerClustererPlus](https://github.com/sandydoo/ember-google-maps-markerclustererplus) — Add marker clustering to your maps with [@googlemaps/markerclustererplus](https://github.com/googlemaps/js-markerclustererplus).


😇 Maintainers
--------------------------------------------------------------------------------

This addon is maintained by **[Sander Melnikov][maintainer-url]**.


Contributing
--------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
--------------------------------------------------------------------------------

[MIT][license-url] © [Sander Melnikov][maintainer-url].


Disclaimer
--------------------------------------------------------------------------------

This software is not endorsed, maintained, or supported by Google LLC.

© 2020 Google LLC All rights reserved. Google Maps™ is a trademark of Google LLC.


[npm-version-badge]: https://img.shields.io/npm/v/ember-google-maps.svg?label=latest
[npm-downloads-badge]: https://img.shields.io/npm/dt/ember-google-maps
[npm-url]: https://www.npmjs.org/package/ember-google-maps

[ci-badge]: https://github.com/sandydoo/ember-google-maps/workflows/CI/badge.svg?branch=main
[ci-url]: https://github.com/sandydoo/ember-google-maps/actions?query=workflow%3ACI

[ember-observer-badge]: https://emberobserver.com/badges/ember-google-maps.svg
[ember-observer-url]: https://emberobserver.com/addons/ember-google-maps

[ember-url]: https://emberjs.com
[google-maps-url]: https://developers.google.com/maps/documentation/javascript/overview

[docs-url]: https://ember-google-maps.sandydoo.me/docs/getting-started
[maintainer-url]: https://github.com/sandydoo
[license-url]: https://github.com/sandydoo/ember-google-maps/blob/main/LICENSE
