/* eslint-disable object-shorthand */

import { get } from '@ember/object';

// Private properties
let proxy, revoke;

/**
 * Create a public API object whose properties map to private properties on a
 * target object.
 *
 * The class constructor accepts two arguments: instance and schema.
 *
 * The instance is the object that will serve as the target or proxy for any
 * getters defined on the public API.
 *
 * The schema is an object that defines the structure of public API. The keys
 * define which properties will be exposed by the class, while the values are
 * strings that map to properties on the proxy.
 *
 * @class PublicAPI
 * @module ember-google-maps/utils/public-api
 * @namespace Utils
 */
export default class PublicAPI {
  constructor(instance, schema) {
    ({ proxy, revoke } = Proxy.revocable(instance, this));

    this.defineProxyProperty(schema, proxy);
  }

  get(target, prop) {
    if (target.isDestroyed || target.isDestroying) {
      revoke();
      throw Error(`Cannot access property ${prop} on the instance because it has been destroyed.`);
    }

    if (typeof target[prop] === 'function') {
      return target[prop].bind(target);
    }

    return get(target, prop);
  }

  defineProxyProperty(schema, proxy, target = this) {
    Object.keys(schema).forEach((prop) => {
      let descriptor = { configurable: true };
      let pointer = schema[prop];

      if (typeof pointer === 'object') {
        let nestedProp = (Object.hasOwnProperty(this, prop)) ? this[prop] : {};
        this.defineProxyProperty(pointer, proxy, nestedProp);
        descriptor['get'] = function() { return nestedProp; };
      } else {
        descriptor['get'] = function() { return proxy[pointer]; };
      }

      Object.defineProperty(target, prop, descriptor);
    });
  }

  reopen(schema) {
    this.defineProxyProperty(schema, proxy);
    return this;
  }
}
