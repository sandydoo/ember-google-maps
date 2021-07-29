'use-strict';

function extractCustomComponentTemplate(pairs) {
  let index = pairs.findIndex(({ key }) => key === 'customComponentTemplate');
  let template = pairs[index];

  // Remove the template component from yielded hash
  pairs.splice(index, 1);

  return template;
}

function makeAddonFactory(addons = {}) {
  return class AddonFactory {
    constructor(env) {
      this.moduleName = env.moduleName;
      this.syntax = env.syntax;
    }

    transform(ast) {
      if (this.moduleName !== 'ember-google-maps/components/g-map.hbs') {
        return ast;
      }

      let b = this.syntax.builders;

      let visitor = {
        MustacheStatement(node) {
          if (node.path.original === 'yield') {
            let pairs = node.params[0].hash.pairs;
            let templatePair = extractCustomComponentTemplate(pairs);
            let template = templatePair.value;

            // Skip if there are no addons, but only after removing the template
            // component
            if (Object.keys(addons).length === 0) {
              return;
            }

            let addonComponents = [];

            for (let [name, componentPath] of Object.entries(addons)) {
              let addon = b.sexpr(
                template.path,
                [b.string(componentPath)],
                template.hash,
                template.loc
              );

              addonComponents.push(b.pair(name, addon, templatePair.loc));
            }

            for (let addon of addonComponents) {
              pairs.push(addon);
            }
          }
        },
      };

      this.syntax.traverse(ast, visitor);

      return ast;
    }
  };
}

module.exports = makeAddonFactory;
