/* eslint-disable object-shorthand */

import { get } from '@ember/object';

// Private properties
let proxy = new WeakMap();

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
    proxy.set(this, instance);

    instance.on('willDestroyElement', () => {
      proxy.set(this, null);
    });

    this.defineProxyProperties(schema);
  }

  get(prop) {
    let target = proxy.get(this);

    if (!target || target.isDestroyed || target.isDestroying) {
      throw Error(`Cannot access property ${prop} on the instance because it has been destroyed.`);
    }

    if (typeof target[prop] === 'function') {
      return target[prop].bind(target);
    }

    return get(target, prop);
  }

  defineProxyProperties(schema, target = this) {
    Object.keys(schema).forEach((prop) => {
      let descriptor = { configurable: true };
      let pointer = schema[prop];

      if (typeof pointer === 'object') {
        let nestedProp = (this.actions) ? this[prop] : {};
        descriptor['get'] = function() { return nestedProp; };

        this.defineProxyProperties(pointer, nestedProp);
      } else {
        let self = this;
        descriptor['get'] = function() { return self.get(pointer); };
      }

      Object.defineProperty(target, prop, descriptor);
    });
  }

  reopen(schema) {
    this.defineProxyProperties(schema);
    return this;
  }
}
