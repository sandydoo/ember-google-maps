'use-strict';

/**
 * Polyfill for Glimmer Element API differences.
 * Copied from https://github.com/ember-polyfills/ember-named-blocks-polyfill/blob/db194feaa322720e134291d5a818702063c4647f/lib/named-blocks-polyfill-plugin.js#L812
 */
function getBuilders(syntax) {
  let b = syntax.builders;

  let element = b.element;

  if (element.length === 2) {
    let buildElementNew = b.element;

    let isCanonical = (args) =>
      args.length <= 4 || args.length > 5 || Array.isArray(args[4]);

    let buildElement = function buildElement(...args) {
      let [tag] = args;

      let options;

      if (isCanonical(args)) {
        let [, attrs, modifiers, children, comments, blockParams, loc] = args;
        options = { attrs, modifiers, children, comments, blockParams, loc };
      } else {
        let [, attrs, modifiers, children, loc] = args;
        options = { attrs, modifiers, children, loc };
      }

      return buildElementNew(tag, options);
    };

    element = buildElement;
  }

  return { ...b, element };
}

module.exports = getBuilders;
