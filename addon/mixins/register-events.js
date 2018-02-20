import Mixin from '@ember/object/mixin';
import Evented from '@ember/object/evented';
import { computed, get } from '@ember/object';
import { reads } from '@ember/object/computed';
import { decamelize } from '@ember/string';
import { schedule } from '@ember/runloop';

/**
 * Register Google Maps events on any map component.
 *
 * The mixin listens for the `didAddComponent` event. It filters the component
 * attributes for those that begin with `on` and are not on the `_ignoreAttrs`
 * list. The attribute name is decamelize and the `on` prefixed is dropped to
 * generate the event name. The attribute function is then bound to that event
 * by name.
 *
 * For example, passing `onClick` will add a `click` event that will
 * call the function passed in as `onClick`.
 */
export default Mixin.create(Evented, {
  domComponent: reads('mapComponent'),

  events: computed(function() {
    const attrs = Object.keys(this.attrs);
    return attrs.filter((attr) => this._filterEventsByName(attr));
  }),

  _filterEventsByName(attr) {
    return attr.startsWith('on') && get(this, '_ignoreAttrs').indexOf(attr) < 0;
  },

  init() {
    this._super(...arguments);
    this.one('didAddComponent', this, this.registerEvents);
  },

  willDestroyElement() {
    const domComponent = get(this, 'domComponent');
    if (domComponent && typeof google !== 'undefined') {
      google.maps.event.clearInstanceListeners(domComponent);
    }
    this._super(...arguments);
  },

  registerEvents() {
    const eventsToRegister = get(this, 'events');
    eventsToRegister.forEach((event) => {
      const eventName = decamelize(event).slice(3);
      const domComponent = get(this, 'domComponent');
      google.maps.event.addDomListener(domComponent, eventName, (e) => {
        if (e && e.stopPropagation) { e.stopPropagation(); }
        schedule('actions',
          this,
          event,
          {
            event: e,
            eventName: eventName,
            target: domComponent,
            publicAPI: this.publicAPI,
            map: get(this, 'map')
          }
        );
      });
    });
  }
});
