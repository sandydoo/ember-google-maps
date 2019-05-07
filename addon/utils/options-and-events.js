import { computed } from '@ember/object';
import { decamelize } from '@ember/string';
import { join } from '@ember/runloop';


const ignoredOptions = [
  'map',
  'lat',
  'lng',
  '_internalAPI',
  'gMap',
  'options',
  'events',
];

function parseOptionsAndEvents(ignored = [], callback = (r) => r) {
  let ignoredSet = new Set(ignored);

  return computed('attrs', function() {
    return callback(parseAttrs(ignoredSet, this.attrs));
  });
}

function parseAttrs(ignored = new Set(), args = {}) {
  let events = { ...args.events };
  let options = { ...args.options };

  let entries = Object.entries(args);

  entries.forEach(([k, v]) => {
    if (isIgnored(k, ignored)) {
      // Pass
    } else if (isEvent(k)) {
      events[k] = v;
    } else {
      options[k] = extractValue(v);
    }
  });

  return { events, options };
}

function isEvent(key) {
  return key.slice(0, 2) === 'on';
}

function isIgnored(key, ignored) {
  return ignored.has(key);
}

function extractValue(cell) {
  if (cell && cell.constructor && Object.keys(cell).includes('value')) {
    return cell.value;
  }
  return cell;
}

function watch(target, options = {}) {
  return Object.entries(options)
    .map(([key, callback]) => addObserver(target, key, callback));
}

function addObserver(obj, key, callback) {
  let listener = obj.addObserver(key, callback);

  return {
    name: key,
    listener,
    remove: () => obj.removeObserver(key, callback)
  };
}


/* Events */

function addEventListener(target, originalEventName, action, payload = {}) {
  let eventName = decamelize(originalEventName).slice(3);

  function callback(googleEvent) {
    let params = {
      event: window.event,
      googleEvent,
      eventName,
      target,
      ...payload,
    };

    join(action, params);
  }

  let listener = google.maps.event.addDomListener(target, eventName, callback);

  return {
    name: eventName,
    listener,
    remove: () => listener.remove()
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
function addEventListeners(target, events, payload = {}) {
  return Object.entries(events).map(([originalEventName, action]) => {
    return addEventListener(target, originalEventName, action, payload);
  });
}

export {
  addEventListener,
  addEventListeners,
  ignoredOptions,
  isEvent,
  isIgnored,
  parseOptionsAndEvents,
  watch
};
