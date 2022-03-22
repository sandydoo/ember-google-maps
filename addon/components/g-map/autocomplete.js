import MapComponent from './map-component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { assert } from '@ember/debug';

export default class Autocomplete extends MapComponent {
  id = `ember-google-maps-autocomplete-${guidFor(this)}`;

  get name() {
    return 'autocompletes';
  }

  setup(options, events) {
    assert(
      `
ember-google-maps: No input found for autocomplete.

When using the block form of the autocomplete component, make sure to call the “setup” method on your input to let autocomplete know about it:

<map.autocomplete as |autocomplete|>
  <input {{did-insert autocomplete.setup}} />
</map.autocomplete>

Did you mean to use the block form? You can also do the following:

<map.autocomplete id="my-custom-id" class="my-custom-class" />
      `,
      this.inputElement
    );

    let autocomplete = new google.maps.places.Autocomplete(
      this.inputElement,
      options
    );

    this.addEventsToMapComponent(autocomplete, events, this.publicAPI);

    // Compatibility: Register the custom `onSearch` event.
    let onSearch = this.args.onSearch;
    if (onSearch && typeof onSearch === 'function') {
      this.addEventsToMapComponent(
        autocomplete,
        { onPlaceChanged: onSearch },
        this.publicAPI
      );
    }

    return autocomplete;
  }

  update(mapComponent) {
    mapComponent?.setOptions?.(this.newOptions);

    return mapComponent;
  }

  @action
  getInput(input) {
    this.inputElement = input;
  }
}
