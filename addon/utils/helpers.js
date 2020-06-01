import { computed, getProperties } from '@ember/object';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

let position = computed('lat', 'lng', function() {
  const { lat, lng } = getProperties(this, 'lat', 'lng');
  return (lat && lng) ? new google.maps.LatLng(lat, lng) : undefined;
});

// This one also doesn't transpile properly.
function position2() {
  return computed('lat', 'lng', function() {
    const { lat, lng } = getProperties(this, 'lat', 'lng');
    return (lat && lng) ? new google.maps.LatLng(lat, lng) : undefined;
  });
}

// The ...args here plays a role and forces babel to add a `var _Ember` in scope.
function computedPromise(...args) {
  let func = args.pop();
  return computed(...args, function() {
    return ObjectPromiseProxy.create({
      promise: func.apply(this)
    });
  });
}

export { computedPromise, position };
