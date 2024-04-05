import { tracked } from '@glimmer/tracking';

import { HAS_NATIVE_PROXY } from './platform';

class PromiseProxy {
  @tracked isRejected = false;
  @tracked isFulfilled = false;
  @tracked content = null;

  constructor(promise) {
    this.promise = promise
      .then((result) => {
        this.content = result;
        this.isFulfilled = true;
        return result;
      })
      .catch((error) => {
        this.isRejected = true;
        throw error;
      });

    let get = (_target, prop) => {
      switch (prop) {
        case 'promise':
          return this.promise;
        case 'then':
        case 'catch':
        case 'finally':
          return this.promise[prop].bind(this.promise);
        default:
          if (this.isFulfilled && this.content) {
            return Reflect.get(this.content, prop);
          }
      }
    };

    return new Proxy(this, { get });
  }
}

export function getAsync(prototype, key, desc) {
  let PROMISES = new WeakMap();

  function getter(...args) {
    let existingProxy = PROMISES.get(desc);

    if (existingProxy) {
      return existingProxy;
    }

    let promise = desc.get.call(this, ...args);

    let proxy;

    if (HAS_NATIVE_PROXY) {
      proxy = new PromiseProxy(promise);
    } else {
      proxy = getAsyncNoProxyFallback(promise);
    }

    PROMISES.set(desc, proxy);

    return proxy;
  }

  return {
    get: getter,
  };
}

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

const ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

function getAsyncNoProxyFallback(promise) {
  return ObjectPromiseProxy.create({ promise });
}
