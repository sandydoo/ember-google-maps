'use-strict';

function makeAddonFactory(addons) {
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
            let [lastPair] = pairs.slice(-1);

            let compExpr = lastPair.value;

            let addonComponents = [];

            for (let [name, componentPath] of Object.entries(addons)) {
              let addon = b.sexpr(
                compExpr.path,
                [b.string(componentPath)],
                compExpr.hash,
                compExpr.loc
              );

              addonComponents.push(b.pair(name, addon, lastPair.loc));
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
