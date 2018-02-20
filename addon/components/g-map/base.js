import Component from '@ember/component';
import RegisterEvents from '../../mixins/register-events';
import MapComponent from '../../mixins/map-component';
import { get, set } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { guidFor } from '@ember/object/internals';
import { defer } from 'rsvp';

const Base = Component.extend(RegisterEvents, MapComponent, {
  tagName: '',

  init() {
    this._super(...arguments);
    this.isInitialized = defer();
    this.publicAPI = {
      id: guidFor(this),
      isInitialized: this.isInitialized,
      actions: {
        update: () => this._updateComponent(),
        getPosition: () => this.getPosition(),
      }
    };
  },

  didInsertElement() {
    this._super(...arguments);
    this._internalAPI._registerComponent(this._type, this.publicAPI);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'map')) {
      if (this._isInitialized) {
        this._updateComponent();
      } else {
        this._addComponent();
      }
    }
  },

  willDestroyElement() {
    tryInvoke(this.mapComponent, 'setMap', [null]);
    this._internalAPI._unregisterComponent(this._type, this.publicAPI);
    this._super(...arguments);
  },

  _didAddComponent() {
    set(this, 'publicAPI.mapComponent', this.mapComponent);
    this.trigger('didAddComponent');
    set(this, '_isInitialized', true);
    this.isInitialized.resolve();
  },

  _updateComponent() {
    let options = get(this, '_options');
    this.mapComponent.setOptions(options);
  },

  getPosition() {
    return this.mapComponent && this.mapComponent.getPosition();
  }
});

Base.reopenClass({
  positionalParams: ['map', '_internalAPI']
});

export default Base;
