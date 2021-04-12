import { decamelize } from '@ember/string';
import { next } from '@ember/runloop';

import { DEBUG } from '@glimmer/env';

// TODO: handle options and events hashes.
export const ignoredOptions = ['lat', 'lng', 'getContext', 'options', 'events', 'classNames'];

const IGNORED = Symbol('Ignored'),
  EVENT = Symbol('Event'),
  OPTION = Symbol('Option');

// TODO: Provide alternative to Proxy for IE11? Or drop IE11 support?
export class OptionsAndEvents {
  constructor(rawArgs) {
    this.rawArgs = rawArgs;

    this.ignoredSet = new Set(ignoredOptions);

    this.optionsCache = new Set();
    this.eventsCache = new Set();

    // Sort and cache the arguments by type.
    this.parse();

    let target = Object.create(null);

    let optionsHandler = new ArgsProxyHandler(rawArgs, this.optionsCache);
    let eventsHandler = new ArgsProxyHandler(rawArgs, this.eventsCache);

    this.options = new Proxy(target, optionsHandler);
    this.events = new Proxy(target, eventsHandler);
  }

  parse() {
    for (let prop in this.rawArgs) {
      let identity = this.identify(prop);

      switch (identity) {
        case OPTION:
          this.optionsCache.add(prop);
          break;

        case EVENT:
          this.eventsCache.add(prop);
          break;

        case IGNORED:
          break;
      }
    }
  }

  identify(prop) {
    if (this.isIgnored(prop)) {
      return IGNORED;
    } else if (this.isEvent(prop)) {
      return EVENT;
    } else {
      return OPTION;
    }
  }

  isEvent(prop) {
    return prop.slice(0, 2) === 'on';
  }

  isIgnored(prop) {
    return this.ignoredSet.has(prop);
  }
}

class ArgsProxyHandler {
  constructor(args, cache) {
    this.args = args;
    this.cache = cache;
    this.setCache = new Map();
  }

  get(_target, prop) {
    if (this.cache.has(prop)) {
      return this.setCache.get(prop) ?? this.args[prop];
    }
  }

  // TODO: Google Maps like to set default stuff. Check how this is going to
  // work.
  set(_target, prop, value) {
    if (value !== undefined) {
      this.cache.add(prop);
      this.setCache.set(prop, value);
      return value;
    } else {
      this.cache.delete(prop);
      this.setCache.delete(prop);
    }
  }

  has(_target, prop) {
    return this.cache.has(prop);
  }

  ownKeys() {
    return Array.from(this.cache.values());
  }

  isExtensible() {
    return false;
  }

  getOwnPropertyDescriptor(_target, prop) {
    if (DEBUG && !this.cache.has(prop)) {
      throw new Error(
        `args proxies do not have real property descriptors, so you should never need to call getOwnPropertyDescriptor yourself. This code exists for enumerability, such as in for-in loops and Object.keys(). Attempted to get the descriptor for \`${String(
          prop
        )}\``
      );
    }

    return {
      enumerable: true,
      configurable: true,
    };
  }
}

/* Events */

export function addEventListener(
  target,
  originalEventName,
  action,
  payload = {}
) {
  let eventName = decamelize(originalEventName).slice(3);

  function callback(googleEvent) {
    let params = {
      event: window.event,
      googleEvent,
      eventName,
      target,
      ...payload,
    };

    next(target, action, params);
  }

  let addGoogleListener =
    target instanceof Element
      ? google.maps.event.addDomListener
      : google.maps.event.addListener;

  let listener = addGoogleListener(target, eventName, callback);

  return {
    name: eventName,
    listener,
    remove: () => listener.remove(),
  };
}

/**
 * Add event listeners on a target object using the cross-browser event
 * listener library provided by the Google Maps API.
 *
 * @param {Object} target
 * @param {Events} events
 * @param {[Object]} payload = {} An optional object of additional parameters
 *     to include with the event payload.
 * @return {google.maps.MapsEventListener[]} An array of bound event listeners
 *     that should be used to remove the listeners when no longer needed.
 */
export function addEventListeners(target, events, payload = {}) {
  return Object.entries(events).map(([originalEventName, action]) => {
    return addEventListener(target, originalEventName, action, payload);
  });
}
