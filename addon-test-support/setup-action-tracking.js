import EmberObject from '@ember/object';
import { Promise } from 'rsvp';

export class ActionTracker {
  constructor() {
    let Tracked = EmberObject.extend();
    this.tracked = Tracked.create();
  }

  seen(name, options = {}) {
    if (!name) {
      return;
    }

    let { timeout = 10000 } = options;

    return new Promise((resolve, reject) => {
      let target = this.tracked[name];
      let observed = () => {
        this.tracked[name].observed = true;
        resolve(this.tracked[name]);
      };

      if (target && target.observed === false) {
        observed();
      }

      this.tracked.addObserver(name, this, observed);

      setTimeout(() => {
        reject(new Error(`Timed out waiting for ${name}.`));
      }, timeout);
    });
  }

  track(name, value) {
    let { current: previous, count = 0 } = this.tracked[name] || {};

    this.tracked.set(name, {
      current: value,
      previous,
      count: ++count,
      observed: false,
    });
  }
}

export default function setupActionTracking(hooks) {
  hooks.beforeEach(function () {
    this.actionTracker = new ActionTracker();
    this.trackAction = (...args) => this.actionTracker.track(...args);
    this.seenAction = (...args) => this.actionTracker.seen(...args);
  });
}
