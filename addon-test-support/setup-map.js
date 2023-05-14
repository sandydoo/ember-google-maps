import { clearMapInstances, getMapInstance } from 'ember-google-maps/utils/helpers';
import { settled } from '@ember/test-helpers';

export function setupMapTest(hooks) {
  hooks.beforeEach(function() {
    this.waitForMap = waitForMap.bind(this);
  });

  hooks.afterEach(function() {
    clearMapInstances();
  });
}

export async function waitForMap(id) {
  await settled();
  return getMapInstance(id);
}
