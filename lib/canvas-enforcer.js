'use-strict';

class CanvasEnforcer {
  constructor(env) {
    this.syntax = env.syntax;
  }

  transform(ast) {
    let b = this.builders;

    let visitor = {
      BlockStatement(node) {
        if (node.path.original === 'g-map') {
          let program = node.program;

          let children = program.body,
              blockParam = program.blockParams;

          if (hasCanvas(children, blockParam)) { return; }

          // No need to parse classNames; we pass them via the component.

          let canvas = b.mustache(
            b.path(`${blockParam}.canvas`)
          );

          children.unshift(canvas);
        }
      },

      ElementNode(node) {
        if (node.tag === 'GMap' || node.tag === 'g-map') {
          // Self-closing tag
          if (node.selfClosing) { return;}


          let children = node.children,
              blockParam = node.blockParams[0];

          if (hasCanvas(children, blockParam)) { return; }


          let attributes = new Map(
            node.attributes
              .filter(({ name }) => name.charAt(0) !== '@')
              .map(a => [a.name, a])
          );

          let classAttr = attributes.get('class');

          if (classAttr) {
            classAttr.value.chars += ' ember-google-map';
            attributes.set('class', classAttr);

          } else {
            let defaultClass = b.attr('class', b.text('ember-google-map'));
            attributes.set('class', defaultClass);
          }

          let canvas = b.element(
            {
              name: `${blockParam}.canvas`,
              selfClosing: true
            },
            Array.from(attributes.values()),
            [],
            [],
            undefined,
            [],
            node.loc
          );

          children.unshift(canvas);
        }
      }
    };

    this.syntax.traverse(ast, visitor);

    return ast;
  }

  /**
   * This nonsense exists because of numerous breaking changes to the Glimmer
   * builder functions.
   *
   * Copied straight from https://github.com/ember-polyfills/ember-named-blocks-polyfill/blob/db194feaa322720e134291d5a818702063c4647f/lib/named-blocks-polyfill-plugin.js#L812
   *
   * It would have taken weeks of digging to get backwards — heck,
   * even forwards — compatability had I not found this! What's going on with
   * Glimmer!?!
   */
  get builders() {
    let b = this.syntax.builders;

    let element = b.element;

    if (element.length === 2) {
      let buildElementNew = b.element;

      let isCanonical = args => args.length <= 4 || args.length > 5 || Array.isArray(args[4]);

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
}

function hasCanvas(nodes, blockParam) {
  for (let node of nodes) {
    // Glimmer
    if (node.type === 'ElementNode' &&  node.tag === `${blockParam}.canvas`) {
      return true
    }

    // Mustache component
    if (node.type === 'MustacheStatement' && node.path.parts[1] === 'canvas')  {
      return true;
    }
  }

  return false;
}

module.exports = CanvasEnforcer;
