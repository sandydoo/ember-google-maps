import { waitFor } from 'ember-native-dom-helpers';
import { run } from '@ember/runloop';

export async function waitForMap(selector = '.gm-style') {
  return await waitFor(selector);
}

/**
 * Wrap the trigger method in an Ember runloop.
 */
export function trigger(component, eventName, ...options) {
  run(() => {
    google.maps.event.trigger(component, eventName, ...options);
  });
}