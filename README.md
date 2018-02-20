# 🗺 ember-google-maps

> A *lightweight*, *declarative*, *composable* API for building ambitious map UIs in your Ember apps.

⚠ **This addon is in active development. APIs may change.** ⚠

##### What this addon *is*:

* ✅ A lightweight Ember API for working with Google Maps.
* ✅ An on-demand, asynchronous loader for the Google Maps API.

##### What this addon *is not*:

* ❌ A bulky, verbose wrapper that reimplements the entire Google Maps API.
* ❌ A whitelist or option validator that is tightly coupled to Google's API.

##### Maintainers

This addon is maintained by @campusboard.

#### Basic usage

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

Should you get tired of writing out every option / event in the template, just provide pre-made options and / or event objects. **Beware** that changes to the object's keys will *not* be observed in this case. You can use the hash template helper or pass the attribute that needs to be watched directly to the component.

```javascript
mapEvents: {
  onBoundsChanged: () => { /* ... */ },
  onCenterChanged: () => { /* ... */ },
  // ...
},
// Static options => will not be watched for changes!
markerOptions: {
  clickable: true,
  draggable: true,
  // ...
}
```

```handlebars
{{#g-map lat='51.508530' lng='-0.076132' zoom=10 events=mapEvents as |g|}}
  {{g.marker lat='51.508530' lng='-0.076132' options=markerOptions}}
{{/g-map}}
```

##### Accessing the map instance

At some point you might need access to the map instance to do things programatically that can't be handled by actions or the template, for example, initiating a fly-to. You can subscribe to the `onLoad` event which will return the instantiated map object once the map has completed loading.

##### Events

You can register listeners for any event by providing an action via the camelized event name with the prefix `on`. For example, for the `click` event you would provide an action via `onClick`. `dblclick` -> `onDblclick`, `bounds_changed` -> `onBoundsChanged`, etc.

Each event by default receives:

* Any curried variables you pass via the action.
* The current component that triggered the event.
* The parent map instance.

#### 👀 Alternatives

The two *maintained* alternatives are [ember-g-map](https://github.com/asennikov/ember-g-map) and [ember-cli-g-maps](https://github.com/Matt-Jensen/ember-cli-g-maps).

Here's a *very subjective* 😬 comparison of the Ember + Google Maps integration addons available today:

|                           | ember-google-maps | ember-g-map       | ember-cli-g-maps  |
| ------------------------- | ----------------- | ----------------- | ----------------- |
| Lightweight               | ✅                | ✅                | ❌               |
| Minimal wrapping          | ✅                | ❌                | ❌               |
| Async API loading         | ✅                | ❌                | ✅               |
| Official Google API       | ✅                | ✅                | ❌               |
| Leverages templates       | ✅                | ✅                | ❌               |
| Contextual components     | ✅                | ❌                | ❌               |
| Minimal observer usage    | ✅                | ❌                | ❌               |
| Native Ember HTML markers | ✅                | ❌                | ❌               |

**ember-g-map** provides a great template-oriented API for working with maps. It is however a bit long in the tooth for some refactoring and upgrades, like supporting contextual components and more Google Maps components. The current architecture makes adding these features quite involved. It also doesn't support loading the Google Maps API asynchronously and by default inserts a render-blocking script tag into your HTML!

**ember-cli-gmaps** actually uses a [custom fork](https://github.com/Matt-Jensen/gmaps-for-apps) of [gmaps](https://github.com/hpneo/gmaps) – a wrapper for the Google Maps API. That's 3 whole layers of complex wrappers tightly coupled to their API all to render a map and some markers in Ember – be wary of this if you are conscious of build sizes and/or technical debt. It also doesn't utilize any of the paradigms that we love about Ember, like templates, contextual components, closure actions, etc.

If you don't need the Google API specifically, check out [ember-leaflet](https://github.com/miguelcobain/ember-leaflet).

## License

[MIT](https://github.com/sandydoo/ember-google-maps/blob/master/LICENSE.md) © Sander Melnikov.