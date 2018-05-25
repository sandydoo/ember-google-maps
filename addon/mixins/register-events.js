import Mixin from '@ember/object/mixin';
import { computed, get, getProperties } from '@ember/object';
import { reads } from '@ember/object/computed';
import { decamelize } from '@ember/string';
import { assign } from '@ember/polyfills';

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
   * @property events
   * @type {Object}
   * @public
   */

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
   * @property _eventAttrs
   * @private
   * @return {Array} An array of extracted event names.
   */
  _eventAttrs: computed('attrs', function() {
    let attrNames = Object.keys(this.attrs);
    return attrNames.filter((attr) => this._filterEventsByName(attr));
  }),

  /**
   * A combination of events passed via the `events` hash and extracted from the
   * component's attributes. Events registered via an attribute take precedence.
   *
   * @property _events
   * @private
   * @return {Object}
   */
  _events: computed('events', '_eventAttrs', function() {
    let events = get(this, 'events');
    let extractedEvents = getProperties(this, get(this, '_eventAttrs'));

    return assign({}, events, extractedEvents);
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
    let eventTarget = get(this, '_eventTarget');

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
    let events = get(this, '_events');

    Object.keys(events).forEach((eventName) => {
      let action = events[eventName];
      let eventTarget = get(this, '_eventTarget');
      eventName = decamelize(eventName).slice(3);

      google.maps.event.addDomListener(eventTarget, eventName, (googleEvent) => {
        let event = window.event;
        let params = {
          event,
          googleEvent,
          eventName,
          target: eventTarget,
          publicAPI: this.publicAPI,
          map: get(this, 'map')
        };

        action(params);
      });
    });
  }
});
