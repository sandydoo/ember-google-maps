import Mixin from '@ember/object/mixin';
import { computed, get } from '@ember/object';
import { reads } from '@ember/object/computed';
import { decamelize } from '@ember/string';

/**
 * Register Google Maps events on any map component.
 *
 * The mixin filters the component attributes for those that begin with `on` and
 * are not on the `_ignoreAttrs` list. The attribute name is decamelize and the
 * `on` prefixed is dropped to generate the event name. The attribute function
 * is then bound to that event by name.
 *
 * For example, passing `onClick` will add a `click` event that will
 * call the function passed in as `onClick`.
 */
export default Mixin.create({
  _eventTarget: reads('mapComponent'),

  events: computed(function() {
    const attrs = Object.keys(this.attrs);
    return attrs.filter((attr) => this._filterEventsByName(attr));
  }),

  _filterEventsByName(attr) {
    return attr.startsWith('on') && get(this, '_ignoreAttrs').indexOf(attr) < 0;
  },

  willDestroyElement() {
    const eventTarget = get(this, '_eventTarget');
    if (eventTarget && typeof google !== 'undefined') {
      google.maps.event.clearInstanceListeners(eventTarget);
    }
    this._super(...arguments);
  },

  registerEvents() {
    const eventsToRegister = get(this, 'events');
    eventsToRegister.forEach((action) => {
      const eventName = decamelize(action).slice(3);
      const eventTarget = get(this, '_eventTarget');

      google.maps.event.addDomListener(eventTarget, eventName, (googleEvent) => {
        if (event && event.stopPropagation) {
          event.stopPropagation();
        }

        if (googleEvent && googleEvent.stop) {
          googleEvent.stop();
        }

        get(this, action)(
          {
            event,
            googleEvent,
            eventName: eventName,
            target: eventTarget,
            publicAPI: this.publicAPI,
            map: get(this, 'map')
          }
        );
      });
    });
  }
});
