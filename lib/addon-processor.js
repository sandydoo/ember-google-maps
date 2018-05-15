'use strict';

let addons;

function deepClone(src) {
  return JSON.parse(JSON.stringify(src));
}

/**
 * Save the addons discovered during build-time for the AST plugin to read
 * later.
 * @param {Array} _addons The array of addons to add.
 */
function sendAddonsToProcessor(_addons) {
  addons = _addons;
}

/**
 * Replace `g-map-addons` in the template with a `yield`, and append new addon
 * components using the first `addonTemplate` defined in the hash as a
 * template.
 */
const AddonProcessor = class AddonProcessor {
  constructor(context) {
    this.context = context;
  }

  transform(ast) {
    let walker = new this.syntax.Walker();

    let b = this.syntax.builders;

    walker.visit(ast, function(node) {
      if (node.type === 'MustacheStatement' && node.path.original === 'g-map-addons') {
        node.path = b.path('yield');

        let pairs = node.params[0].hash.pairs;
        let addonTemplate = pairs.shift();

        addons.forEach(({ key, component }) => {
          let addonNode = deepClone(addonTemplate);
          let componentName = addonNode.value.params[0];

          addonNode.key = key;
          componentName.value = component;
          componentName.original = component;

          pairs.push(addonNode);
        });
      }
    });

    return ast;
  }
};

module.exports = { AddonProcessor, sendAddonsToProcessor };
