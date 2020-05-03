import { computed, getProperties } from '@ember/object';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

let position = computed('lat', 'lng', function() {
  const { lat, lng } = getProperties(this, 'lat', 'lng');
  return (lat && lng) ? new google.maps.LatLng(lat, lng) : undefined;
});

function computedPromise(...args) {
  let func = args.pop();
  return computed(...args, function() {
    return ObjectPromiseProxy.create({
      promise: func.apply(this)
    });
  });
}

export { computedPromise, position };
