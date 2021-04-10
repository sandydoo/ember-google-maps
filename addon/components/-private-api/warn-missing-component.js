import Component from '@glimmer/component';
import { assert } from '@ember/debug';

/**
 * Throw an assertion to warn the user when they call a component that isn't
 * included in the build. In development, we replace the excluded component with
 * this one instead.
 */
export default class WarnMissingComponent extends Component {
  constructor() {
    super(...arguments);

    let name = this.args.name;

    let message = `
Ember Google Maps couldn't find a map component called "${name}"!

If you are excluding certain map components from your app in your ember-cli-build.js, make sure to
include "${name}".

Learn more at: https://ember-google-maps.sandydoo.me/docs/getting-started`;

    assert(message);
  }
}
