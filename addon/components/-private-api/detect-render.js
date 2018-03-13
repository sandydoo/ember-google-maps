import Component from '@ember/component';

/**
 * Empty component to watch the contents of overlays for changes. Pass in an
 * action on `didRender` to react to content changes.
 *
 * The overlay component is rerendered when the marker is repositioned on zoom.
 * As a result, it's not possible to tell what causes the rerender – changes in
 * the template or setting the new position. This separate component wrapper
 * lets us decouple the content block's rendering logic from the marker.
 *
 * @class DetectRender
 * @module ember-google-maps/components/-private-api/detect-render
 * @extends Component
 * @private
 */
export default Component.extend();
