import { Promise, resolve } from 'rsvp';

export class ActionTracker {
  constructor() {
    this.tracked = new Map();
    this.watcher = new Map();
  }

  seen(name, options = {}) {
    if (!name) {
      return;
    }

    let target = this.tracked.get(name);

    if (target?.count > target?.lastSeen) {
      this.tracked.set(name, {
        ...target,
        lastSeen: target.count,
      });
      return resolve();
    }

    let { timeout = 10000 } = options;

    return new Promise((resolve, reject) => {
      this.watcher.set(name, resolve);

      setTimeout(() => {
        reject(new Error(`Timed out waiting for ${name}.`));
      }, timeout);
    });
  }

  notify(name) {
    let resolve = this.watcher.get(name);
    this.watcher.delete(name);
    return resolve?.();
  }

  track(name) {
    let { count = 0, lastSeen = 0 } = this.tracked.get(name) ?? {};

    this.tracked.set(name, {
      count: ++count,
      lastSeen,
    });

    if (this.watcher.has(name)) {
      this.notify(name);
    }
  }
}

export default function setupActionTracking(hooks) {
  hooks.beforeEach(function () {
    this.actionTracker = new ActionTracker();
    this.trackAction = (...args) => this.actionTracker.track(...args);
    this.seenAction = (...args) => this.actionTracker.seen(...args);
  });
}
