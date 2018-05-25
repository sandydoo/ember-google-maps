import Mixin from '@ember/object/mixin';
import { computed, get } from '@ember/object';
import { reads } from '@ember/object/computed';
import { decamelize } from '@ember/string';

/**
 * Register Google Maps events on any map component.
 *
 * The mixin filters the component attributes for those that begin with `on` and
 * are not on the `_ignoredAttrs` list. The attribute name is decamelize and the
 * `on` prefixed is dropped to generate the event name. The attribute function
 * is then bound to that event by name.
 *
 * For example, passing `onClick` will add a `click` event that will
 * call the function passed in as `onClick`.
 *
 * @class RegisterEvents
 * @module ember-google-maps/mixins/register-events
 * @extends Ember.Mixin
 */
export default Mixin.create({
  /**
   * The target DOM node or Google Maps object to which to attach event
   * listeners.
   *
   * @property eventTarget
   * @type {HTMLNode|MVCObject}
   * @private
   */
  _eventTarget: reads('mapComponent'),

  /**
   * Filter the array of passed attributes for attributes that begin with `on`.
   *
   * @property events
   * @type {Array}
   * @public
   */
  events: computed(function() {
    const attrs = Object.keys(this.attrs);
    return attrs.filter((attr) => this._filterEventsByName(attr));
  }),

  /**
   * Return true if the passed attribute matches the syntax for an event, i.e.
   * begins with `on` and is not explicitly ignored in `_ignoredAttrs`.
   *
   * @method _filterEventsByName
   * @param {String} attr
   * @private
   * @return {Boolean}
   */
  _filterEventsByName(attr) {
    return attr.slice(0, 2) === 'on' && get(this, '_ignoredAttrs').indexOf(attr) === -1;
  },

  willDestroyElement() {
    const eventTarget = get(this, '_eventTarget');
    if (eventTarget && typeof google !== 'undefined') {
      google.maps.event.clearInstanceListeners(eventTarget);
    }
    this._super(...arguments);
  },

  /**
   * Register an event listener on the eventTarget for each event provided.
   *
   * @method registerEvents
   * @private
   * @return
   */
  registerEvents() {
    const eventsToRegister = get(this, 'events');
    eventsToRegister.forEach((action) => {
      const eventName = decamelize(action).slice(3);
      const eventTarget = get(this, '_eventTarget');

      google.maps.event.addDomListener(eventTarget, eventName, (googleEvent) => {
        let event = window.event;

        get(this, action)(
          {
            event,
            googleEvent,
            eventName,
            target: eventTarget,
            publicAPI: this.publicAPI,
            map: get(this, 'map')
          }
        );
      });
    });
  }
});
