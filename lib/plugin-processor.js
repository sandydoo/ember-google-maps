'use strict';

let plugins;

function deepClone(src) {
  return JSON.parse(JSON.stringify(src));
}

/**
 * Save the plugins discovered during build-time for the AST plugin to read
 * later.
 * @param {Array} _plugins The array of plugins to add.
 */
function sendPluginsToProcessor(_plugins) {
  plugins = _plugins;
}

/**
 * Replace `g-map-plugins` in the template with a `yield`, and append new plugin
 * components using the first `pluginTemplate` defined in the hash as a
 * template.
 */
const PluginProcessor = class PluginProcessor {
  constructor(context) {
    this.context = context;
  }

  transform(ast) {
    let walker = new this.syntax.Walker();

    let b = this.syntax.builders;

    walker.visit(ast, function(node) {
      if (node.type === 'MustacheStatement' && node.path.original === 'g-map-plugins') {
        node.path = b.path('yield');

        let pairs = node.params[0].hash.pairs;
        let pluginTemplate = pairs.shift();

        plugins.forEach(({ key, component }) => {
          let pluginNode = deepClone(pluginTemplate);
          let componentName = pluginNode.value.params[0];

          pluginNode.key = key;
          componentName.value = component;
          componentName.original = component;

          pairs.push(pluginNode);
        });

        pairs.shift();
      }
    });

    return ast;
  }
};

module.exports = { PluginProcessor, sendPluginsToProcessor };
