'use-strict';

const { newExcludeName, skipTreeshaking } = require('../treeshaking');

function makeTreeshaker(params) {
  let name = 'treeshaker';
  let doNothing = { name, visitor: {} };

  return (env) => {
    let { included, excluded, isProduction } = params;
    let shouldSkipTreeshaking = skipTreeshaking(included, excluded);

    if (
      shouldSkipTreeshaking ||
      env.moduleName !== 'ember-google-maps/components/g-map.hbs'
    ) {
      return doNothing;
    }

    let b = env.syntax.builders;
    let shouldExcludeName = newExcludeName(included, excluded);

    let visitor = {
      MustacheStatement(node) {
        if (node.path.original === 'yield') {
          let hash = node.params[0].hash;
          let pairs = hash.pairs;

          let newPairs = [];

          for (let pair of pairs) {
            // Include non-component data
            if (['map', 'canvas'].includes(pair.key)) {
              newPairs.push(pair);
              continue;
            }

            // Check if this is a component
            let compExpr = pair.value;
            if (!compExpr) {
              newPairs.push(pair);
              continue;
            }

            if (shouldExcludeName(pair.key)) {
              // Exclude components that we don't want in the production build.
              if (isProduction) {
                continue;
              }

              // Replace an excluded component with a debug component in
              // development and testing. This component should warn the user
              // of misconfigured treeshaking.
              let warnMissing = b.pair(
                pair.key,
                b.sexpr(
                  compExpr.path,
                  [b.string('-private-api/warn-missing-component')],
                  b.hash([b.pair('name', b.string(pair.key))])
                )
              );

              newPairs.push(warnMissing);
              continue;
            }

            // Add components that aren’t excluded
            newPairs.push(pair);
          }

          hash.pairs = newPairs;
        }
      },
    };

    return { name, visitor };
  };
}

module.exports = makeTreeshaker;
