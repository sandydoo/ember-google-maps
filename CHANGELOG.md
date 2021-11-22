# Changelog









## v5.0.0 (2021-11-22)

#### :boom: Breaking changes
* [#161](https://github.com/sandydoo/ember-google-maps/pull/161) Drop support for `@classNames`. Use `class` instead. ([@sandydoo](https://github.com/sandydoo))

If you had the following:
```hbs
<GMap @classNames="my-custom-class" />
```

Replace `@classNames` with the `class` attribute:
```hbs
<GMap class="my-custom-class" />
```

* [#160](https://github.com/sandydoo/ember-google-maps/pull/160) Drop support for the `onLoad` event ([@sandydoo](https://github.com/sandydoo))

The `onLoad` event has been removed. You should replace it with `onceOnIdle`.

If you had the following:
```hbs
<GMap @lat={{this.lat}} @lng={{this.lng}} @onLoad={{this.didLoadMap}} />
```

Replace it with:
```hbs
<GMap @lat={{this.lat}} @lng={{this.lng}} @onceOnIdle={{this.didLoadMap}} />
```

* [#158](https://github.com/sandydoo/ember-google-maps/pull/158) Drop support for Ember `<3.24` and Node `10` ([@sandydoo](https://github.com/sandydoo))

#### Internal
* [#159](https://github.com/sandydoo/ember-google-maps/pull/159) Fix broken build tests ([@sandydoo](https://github.com/sandydoo))
* [#157](https://github.com/sandydoo/ember-google-maps/pull/157) Remove the landing page ([@sandydoo](https://github.com/sandydoo))
* [#154](https://github.com/sandydoo/ember-google-maps/pull/154) Implement simpler workaround for auto-import #152 ([@sandydoo](https://github.com/sandydoo))
* [#153](https://github.com/sandydoo/ember-google-maps/pull/153) Fix tests against ember `>=4` ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.2.7 (2021-10-11)

#### :bug: Bug fixes
* [#151](https://github.com/sandydoo/ember-google-maps/pull/151) Update the coordinates when `lat` and `lng` are updated ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.2.6 (2021-09-08)

#### :book: Documentation
* [#149](https://github.com/sandydoo/ember-google-maps/pull/149) Explain how to write acceptance and integrations tests with maps ([@sandydoo](https://github.com/sandydoo))
* [#146](https://github.com/sandydoo/ember-google-maps/pull/146) Upgrade dependencies ([@sandydoo](https://github.com/sandydoo))

#### Internal
* [#148](https://github.com/sandydoo/ember-google-maps/pull/148) Add an acceptance test to the test suite ([@sandydoo](https://github.com/sandydoo))
* [#147](https://github.com/sandydoo/ember-google-maps/pull/147) Update yarn.lock ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.2.5 (2021-08-24)

This release is compatible with the upcoming v4.0 release of Ember.js.

#### :bug: Bug fixes
* [#140](https://github.com/sandydoo/ember-google-maps/pull/140) Return the `google` global from the API service if Google Maps has already been loaded ([@grodriguez85](https://github.com/grodriguez85))

#### Internal
* [#144](https://github.com/sandydoo/ember-google-maps/pull/144) Cache yarn's global cache of packages in CI ([@sandydoo](https://github.com/sandydoo))
* [#141](https://github.com/sandydoo/ember-google-maps/pull/141) Fix CI for external PRs ([@sandydoo](https://github.com/sandydoo))
* [#143](https://github.com/sandydoo/ember-google-maps/pull/143) Fix test-waiters import errors in embroider builds ([@sandydoo](https://github.com/sandydoo))
* [#142](https://github.com/sandydoo/ember-google-maps/pull/142) Refactor AST plugins to match new plugin format ([@sandydoo](https://github.com/sandydoo))

#### Committers: 2
- Gustavo Rodriguez ([@grodriguez85](https://github.com/grodriguez85))
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.2.4 (2021-08-04)

#### :bug: Bug fixes
* [#139](https://github.com/sandydoo/ember-google-maps/pull/139) Fix teardown errors in FastBoot ([@sandydoo](https://github.com/sandydoo))

#### :book: Documentation
* [#138](https://github.com/sandydoo/ember-google-maps/pull/138) Pre-render docs when building with Embroider ([@sandydoo](https://github.com/sandydoo))
* [#137](https://github.com/sandydoo/ember-google-maps/pull/137) Pre-render the clustering docs ([@sandydoo](https://github.com/sandydoo))
* [#136](https://github.com/sandydoo/ember-google-maps/pull/136) Document `ember-google-maps-markerclustererplus` ([@sandydoo](https://github.com/sandydoo))
* [#135](https://github.com/sandydoo/ember-google-maps/pull/135) [docs] Fix docs build ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.2.3 (2021-07-29)

#### :bug: Bug fixes
* [#134](https://github.com/sandydoo/ember-google-maps/pull/134) Fix errors trying to find a `template` component ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.2.2 (2021-07-27)

#### :bug: Bug fixes
* [#131](https://github.com/sandydoo/ember-google-maps/pull/131) Move test-waiters to dependencies ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.2.1 (2021-07-27)

#### :bug: Bug fixes
* [#128](https://github.com/sandydoo/ember-google-maps/pull/128) Tear down controls properly ([@sandydoo](https://github.com/sandydoo))
* [#126](https://github.com/sandydoo/ember-google-maps/pull/126) Tear down components that don't have an update method ([@sandydoo](https://github.com/sandydoo))
* [#127](https://github.com/sandydoo/ember-google-maps/pull/127) Fix issue where directions were re-fetched when resolved ([@sandydoo](https://github.com/sandydoo))

#### Internal
* [#129](https://github.com/sandydoo/ember-google-maps/pull/129) Upgrade miscellaneous dependencies and fixup testing ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.2.0 (2021-07-24)

#### :star: Features
* [#125](https://github.com/sandydoo/ember-google-maps/pull/125) Allow registering custom components ([@sandydoo](https://github.com/sandydoo))

#### :bug: Bug fixes
* [#123](https://github.com/sandydoo/ember-google-maps/pull/123) Unregister components on teardown ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.1.0 (2021-07-20)

#### :star: Features
* [#118](https://github.com/sandydoo/ember-google-maps/pull/118) Add rectangle component ([@sandydoo](https://github.com/sandydoo))
* [#119](https://github.com/sandydoo/ember-google-maps/pull/119) Add polygon component ([@sandydoo](https://github.com/sandydoo))

#### :bug: Bug fixes
* [#121](https://github.com/sandydoo/ember-google-maps/pull/121) Don't error out when setting an undefined option ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.0.1 (2021-06-14)

Update the README with the new supported versions of the addon.


## v4.0.0 (2021-06-14)

First stable release of the 4.0 beta cycle! 🎉

#### Internal
* [#117](https://github.com/sandydoo/ember-google-maps/pull/117) Extract the common map component setup pattern into a new class ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.0.0-beta.10 (2021-06-13)

#### :bug: Bug fixes
* [#116](https://github.com/sandydoo/ember-google-maps/pull/116) Temporarily switch to a patched version of `tracked-maps-and-sets` ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.0.0-beta.9 (2021-06-11)

#### :boom: Breaking changes
* [#115](https://github.com/sandydoo/ember-google-maps/pull/115) Drop IE11 as a target ([@sandydoo](https://github.com/sandydoo))

#### :bug: Bug fixes
* [#112](https://github.com/sandydoo/ember-google-maps/pull/112) Fix modifier manager capabilities deprecation ([@sandydoo](https://github.com/sandydoo))

#### Internal
* [#113](https://github.com/sandydoo/ember-google-maps/pull/113) Fix test waiter deprecations in CI logs ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.0.0-beta.8 (2021-05-08)

#### :boom: Breaking changes
* [#111](https://github.com/sandydoo/ember-google-maps/pull/111) Deprecate the `onLoad` event ([@sandydoo](https://github.com/sandydoo))

#### :bug: Bug fixes
* [#110](https://github.com/sandydoo/ember-google-maps/pull/110) Fix build tests ([@sandydoo](https://github.com/sandydoo))

#### Internal
* [#110](https://github.com/sandydoo/ember-google-maps/pull/110) Fix build tests ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.0.0-beta.7 (2021-05-06)

#### :boom: Breaking changes
* [#107](https://github.com/sandydoo/ember-google-maps/pull/107) Add `onceOn` events that fire only once ([@sandydoo](https://github.com/sandydoo))
* [#106](https://github.com/sandydoo/ember-google-maps/pull/106) Remove `onComponentsLoad` hook ([@sandydoo](https://github.com/sandydoo))

#### :star: Features
* [#107](https://github.com/sandydoo/ember-google-maps/pull/107) Add `onceOn` events that fire only once ([@sandydoo](https://github.com/sandydoo))

#### :bug: Bug fixes
* [#108](https://github.com/sandydoo/ember-google-maps/pull/108) Fix build errors when using both only and except lists to treeshake components ([@sandydoo](https://github.com/sandydoo))

#### Internal
* [#109](https://github.com/sandydoo/ember-google-maps/pull/109) Improve how we wait for the map in tests ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.0.0-beta.6 (2021-05-01)

#### :bug: Bug fixes
- [#103](https://github.com/sandydoo/ember-google-maps/pull/103) Fix runloop imports for older Ember versions ([@sandydoo](https://github.com/sandydoo))
- [#104](https://github.com/sandydoo/ember-google-maps/pull/104) Fix builds for node@10 ([@sandydoo](https://github.com/sandydoo))

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v4.0.0-beta.5 (2021-04-23)

### 🐞 Bug fixes

- __Fix overlay teardown__
  Overlays could throw an error when being removed from the map.

- __Fix builds for apps that use Embroider__
  

## v4.0.0-beta.4 (2021-04-18)

### 🛠️  Improvements

- __Full conversion to Ember Octane__
   In practice, this means you'll get better performance, especially during the initial render. There are much fewer runloop and async shenanigans to get Google Maps and Ember to play well.


## v3.3.3 (2021-04-02)

### 🐞 Bug fixes

- __Fix errors when using this addon with FastBoot.__


## v4.0.0-beta.3 (2021-03-22)

### 🛠️ Improvements

- __Set the `beta` tag on npm to this version.__
  There are no changes in this release.
  It turns out you have to additionally tag `beta` versions as `beta` when publishing, otherwise npm treats it as the latest version.


## v3.3.2 (2021-03-22)

### 🛠️ Improvements

- __Set the `latest` tag on npm to this version.__
  There are no changes in this release.
  It turns out you have to additionally tag `beta` versions as `beta` when publishing, otherwise npm treats it as the latest version.


## v3.3.1 (2021-03-18)

### 🐞 Bug fixes

- __Loosen version range on `ember-concurrency` (#101)__
  This fix let’s you use `ember-concurrency@2.0+` in your apps.


## v4.0.0-beta.0 (2021-02-16)

### 💥 Breaking changes

- #### Drop support for Ember `v2.18`
  Ember is moving on and so are we. Ember LTS `v3.16` and Ember CLI `v3.16` are the new minimum requirements. This update already drops a few hacks that enabled backwards compatibility. Now, the addon can be completely upgraded to Glimmer components for some serious performance improvements.

- #### Update docs to Octane
   All of the examples in the docs are now up to modern Ember standards. The docs app itself now runs completely on Octane.

- #### No more mixins
   This only affects you if you’ve created your own custom map components.


## v3.3.0 (2020-12-21)

### 🐞 Bug fixes

* Fix runtime errors in `ember@canary` related to the old optional canvas support.


### 🛠️ Improvements

* #### Replace the runtime optional canvas support with a build-time solution.

  Instead of wasting render cycles detecting whether the map should render a default canvas or not, we inject
  a canvas into the template during the build where necessary.

  This improves rendering performance and rules out the possibility of render timing bugs (#99).

  Full compatibility, starting with `v2.18+` to modern `Octane` versions.


## v3.3.0-beta.0 (2020-11-26)

### 🛠️ Improvements

* #### Replace the runtime optional canvas support with a build-time solution.

  Instead of wasting render cycles detecting whether the map should render a default canvas or not, we inject
  a canvas into the template during the build where necessary.

  This improves rendering performance and rules out the possibility of render timing bugs (#99).

  Full compatibility, starting with `v2.18+` to modern `Octane` versions.


## v3.2.4 (2020-11-09)

### 🐞 Bug fixes

* Remove dynamic component calls that are incompatible with Embroider.


## v3.2.3 (2020-11-03)

### 🛠 Improvements

* Switch CI service to GitHub Actions.
* Update the CI badges in the README and docs.
* Remove the `.github` folder from the NPM package.


## v3.2.2 (2020-10-23)

### 🛠 Improvements

* Upgrade dependencies.
* Remove development dependency on an external sample addon used for testing. It was being rate limited by GitHub. Downstream apps should not have been impacted, but I'm bumping the version to be safe.


## v3.2.1 (2020-08-24)

### 🐞 Bug fixes

* Fix scheduling errors when adding and removing waypoints in Ember v3.21.


## v3.2.0 (2020-08-24)

### 🛠 Improvements

* Refactor usages of `-in-element` to the public `in-element` with a polyfill for older Ember versions. Fixes #98. Thanks, @basz.

* Upgrade dependencies


## v3.1.0 (2020-07-27)

#### :star: Features
* [#97](https://github.com/sandydoo/ember-google-maps/pull/97) Add support for Cloud-based Map Styling ([@DavidPhilip](https://github.com/DavidPhilip))

#### Committers: 1
- davidphilip ([@DavidPhilip](https://github.com/DavidPhilip))


## v3.0.6 (2020-07-23)

### 🐞 Bug fixes

* Publish the addon-test-support folder on npm. This folder has useful test harness functions. #96 


## v3.0.5 (2020-06-17)

### 🐞 Bug fixes

* Remove an old util export. It broke Embroider builds.


## v3.0.4 (2020-06-05)

### 🐞 Bug fixes

* Fix ember-cli warning about a missing addon when building the addon within an app.


## v3.0.3 (2020-05-31)

### 🐞 Bug fixes

* Fix a transpilation error with ember-cli-babel@7.20.* when transpiling with IE 11 as a target.

### 🛠 Improvements

* Remove build-time warning when no API key is provided. Since we allow runtime configuration, this warning is now thrown at runtime in development. Fixes #74.

* Add tests to treeshaking code


## v3.0.2 (2020-05-06)

### 🐞 Bug fixes

* Fix runloop bugs in overlays. Quickly adding and removing overlays in succession could break the overlay, throwing runtime errors.

### 🛠 Improvements

* Add performance shakedown test for overlays.


## v3.0.1 (2020-05-03)

### 🐞 Bug fixes

* Fix bug in scheduling code that could result in runtime errors.


## v3.0.0 (2020-04-27)

Remove `beta` tag.  🎉

### 🐞 Bug fixes

* #91 Pass HTML attributes, like `class` and `id`, to the default canvas.


## v3.0.0-beta.5 (2020-03-28)

⭐️ Features

* #90 Allow setting an index on controls to "control" their order when displaying multiple controls at the same position.


## v3.0.0-beta.4 (2020-02-25)

### 🐞 Bug fixes

* #88 Fix addon build process when used in Ember Engines.
* #88 Fix addon build process when built with Ember CLI v3.13+.

### 🛠 Improvements

* Add support for debugging the build process with `broccoli-debug`.


## v3.0.0-beta.3 (2020-02-08)

### 🐞 Bug fixes


## v2.2.7 (2020-02-25)

### 🐞 Bug fixes

* #88 Fix addon build process when used in Ember Engines.
* #88 Fix addon build process when built with Ember CLI v3.13+.

### 🛠 Improvements

* Add support for debugging the build process with `broccoli-debug`.


## v2.2.6 (2020-02-08)

### 🐞 Bug fixes

* #87 Improve runloop handling for template values read from the `google` object, e.g. control positions. 

### 🛠 Improvements

* Add a warning when trying to use a "treeshaken" component in development mode. This should protect against issues like #59 in the future.


## v3.0.0-beta.2 (2020-01-24)

### 🐞 Bug fixes

* Fix event handling for polyline components. Fixes #86.
* Fix rendering issue for info windows with block content.


## v3.0.0-beta.1 (2019-12-04)

### 🐞 Bug fixes

* Fix info window rendering when attached to markers.

### 🛠 Improvements

* Improve info window tests.


## v3.0.0-beta.0 Almost Octane... (2019-12-04)

## Major preparation for Ember Octane.

This release lays the foundation to moving the addon to Octane components. The main expected benefit is performance, especially when rendering hundreds of markers on less performant devices.

### 🛠 Improvements

* Refactor options and event parsing. This removes all class mixins from the addon. Components now have an new `_createOptions` hook that can be overriden to modify the options before passing them to the map component.

* Improve map component lifecycle control.

* Simplify public API creation.

* Update the Overlay component as discussed in #55.

    * **BREAKING CHANGE**
       Remove `innerContainerStyle`.
       
       [Read the upgrade guide here ›](https://github.com/sandydoo/ember-google-maps/commit/eb2b1be42e074118e65fc8c68504624c822876b5)

    * Add `zIndex` option to overlays.


## v2.2.5 (2019-12-04)

### 🐞 Bug fixes

* Fix info window rendering when attached to markers.

### 🛠 Improvements

* Improve info window tests.


## v2.2.4 (2019-11-20)

### 🐞 Bug fixes

* #79 Unpin ember-concurrency that was accidentally version-pinned.


## v2.2.3 (2019-10-12)

#### :bug: Bug fixes
* #75 Update ember-concurrency to fix runtime error.
* [#68](https://github.com/sandydoo/ember-google-maps/pull/68) fix: Splat html attributes on the canvas div element ([@Windvis](https://github.com/Windvis))

#### 🛠 Improvements
* Improve tests for map canvas elements.

#### Committers: 2
- Sam Van Campenhout ([@Windvis](https://github.com/Windvis))
- [@colenso](https://github.com/colenso)


## v2.2.2 (2019-08-07)

### 🐞 Bug fixes

* #67 Fix setting `class` on a map canvas.
* Fix canvas rendering in FastBoot.
* Fix runtime errors for apps without FastBoot.


## v2.2.1 (2019-07-27)

### 🛠 Improvements

* Upgrade dependencies.
* Add support for newer Ember versions.


## v2.2.0 (2019-07-25)

#### :star: Features
* [#57](https://github.com/sandydoo/ember-google-maps/pull/57) Add optional runtime configuration to API loader ([@sandydoo](https://github.com/sandydoo))

#### 🛠 Improvements

* #49 Fix treeshaking bugs.
* #65 Remove in-repo addon from consuming app builds.
* #45 Fix event listener deprecation warnings.
* #64 Fix event listeners for directions.

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v2.1.0 (2018-12-07)

#### :star: Features
* [#41](https://github.com/sandydoo/ember-google-maps/pull/41) Add ability to specify a class name for the control component ([@acorncom](https://github.com/acorncom))
* [#38](https://github.com/sandydoo/ember-google-maps/pull/41) Support loading in-repo g-map addons

#### :bug: Bug fixes
* [#30](https://github.com/sandydoo/ember-google-maps/pull/30) Add a few defensive guards against set on destroyed object errors ([@acorncom](https://github.com/acorncom))
* [#40](https://github.com/sandydoo/ember-google-maps/pull/40) Add finer grained control over de-registration of a component from the publicAPI proxy ([@acorncom](https://github.com/acorncom))

#### 🛠 Improvements
* Upgrade dependencies.

#### Committers: 1
- David Baker ([@acorncom](https://github.com/acorncom))


## v2.0.5 (2018-09-08)

#### :bug: Bug fixes
* [#34](https://github.com/sandydoo/ember-google-maps/pull/34) Fix short-circuit logic when loading the API ([@sandydoo](https://github.com/sandydoo))

#### Committers: 2
- David Baker ([@acorncom](https://github.com/acorncom))
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v2.0.0 (2018-06-03)

This release consists of largely internal improvements and features. There are a few minor changes to the `publicAPI` – the public properties and actions returned when an event/action is triggered. 

#### :boom: Breaking changes
* Expose a consistent public API object. The changes here should be minor.
* Action hooks like `onLoad` no longer return a `map` as a separate argument. They always return the `publicAPI` object. Check your actions!
* Drop node 4 support. ☠️ 

#### :star: Features
* Expose test helpers.  A `setupMapTest` hook that ensures tests wait for the map to render and a `trigger` helper to trigger map events.
* Introduce an addon system.

* [#17](https://github.com/sandydoo/ember-google-maps/pull/17) 🌟 Addon system ([@sandydoo](https://github.com/sandydoo))
* [#21](https://github.com/sandydoo/ember-google-maps/pull/21) Refactor internals – 🎬 2  ([@sandydoo](https://github.com/sandydoo))
* [#20](https://github.com/sandydoo/ember-google-maps/pull/20) Improve legacy browser support ([@sandydoo](https://github.com/sandydoo))
* [#19](https://github.com/sandydoo/ember-google-maps/pull/19) Expose test helpers ([@sandydoo](https://github.com/sandydoo))
* [#16](https://github.com/sandydoo/ember-google-maps/pull/16) Improve the public API object ([@sandydoo](https://github.com/sandydoo))

#### 🛠 Improvements

* Refactor the internals to make it simpler to extend and create custom components.
* Improve performance of overlays and info windows.
* Improve IE support.
* Upgrade Ember.
* Improve docs site.

#### Committers: 1
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))


## v1.1.0 (2018-04-09)

#### :bug: Bug fixes
* [#10](https://github.com/sandydoo/ember-google-maps/pull/10) fixes attrs not updating ([@ryanholte](https://github.com/ryanholte))

#### Committers: 1
- Ryan Holte ([@ryanholte](https://github.com/ryanholte))


## v1.0.1 (2018-03-09)

#### :star: Features
* [#9](https://github.com/sandydoo/ember-google-maps/pull/9) Refactor autocomplete to be more flexible in terms of input ([@sandydoo](https://github.com/sandydoo))
* [#2](https://github.com/sandydoo/ember-google-maps/pull/2) Add additional warnings for Google Maps API usage ([@steveszc](https://github.com/steveszc))

#### :bug: Bug fixes
* [#2](https://github.com/sandydoo/ember-google-maps/pull/2) Add additional warnings for Google Maps API usage ([@steveszc](https://github.com/steveszc))

#### Committers: 2
- Sander Melnikov ([@sandydoo](https://github.com/sandydoo))
- Steve Szczecina ([@steveszc](https://github.com/steveszc))
