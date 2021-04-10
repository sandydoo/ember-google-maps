import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { Promise, resolve } from 'rsvp';

export function toLatLng(lat, lng) {
  return lat && lng && google.maps ? new google.maps.LatLng(lat, lng) : undefined;
}

let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

export function toPromiseProxy(closure) {
  return ObjectPromiseProxy.create({
    promise: closure(),
  });
}

export function promisify(maybePromise) {
  return maybePromise instanceof Promise ? maybePromise : resolve(maybePromise);
}
