import GMap from 'ember-google-maps/components/g-map';
import { settled } from '@ember/test-helpers';

let lastKey;
const MAP_STORE = new Map();

function addToStore(id, map) {
  MAP_STORE.set(id, map);
  lastKey = id;
}

function getFromStore(id) {
  if (id) {
    return MAP_STORE.get(id);
  }

  return MAP_STORE.get(lastKey);
}

function resetStore() {
  MAP_STORE.clear();
}

export async function waitForMap(id) {
  await settled();

  return getFromStore(id);
}

export default function setupMapTest(hooks) {
  hooks.beforeEach(function () {
    this.waitForMap = waitForMap.bind(this);

    this.owner.register(
      'component:g-map',
      class InstrumentedGMap extends GMap {
        constructor() {
          super(...arguments);

          addToStore(this.id, this);
        }
      }
    );
  });

  hooks.afterEach(function () {
    resetStore();
  });
}
