import GMap from 'ember-google-maps/components/g-map';
import { settled } from '@ember/test-helpers';
import { action } from '@ember/object';

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

export function setupMapTest(hooks) {
  hooks.beforeEach(function () {
    this.waitForMap = waitForMap.bind(this);

    // TODO can we do this from within g-map? I guess the main issue with that
    // is figuring out how to remove all this code from the production build.
    this.owner.register(
      'component:g-map',
      class InstrumentedGMap extends GMap {
        @action
        getCanvas(canvas) {
          super.getCanvas(canvas);
          addToStore(canvas.id, this.publicAPI);
        }
      }
    );
  });

  hooks.afterEach(function () {
    resetStore();
  });
}
