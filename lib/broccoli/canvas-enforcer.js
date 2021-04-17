'use-strict';

const getBuilders = require('./builders');

class CanvasEnforcer {
  constructor(env) {
    this.syntax = env.syntax;
  }

  transform(ast) {
    let b = getBuilders(this.syntax);

    let visitor = {
      BlockStatement(node) {
        if (node.path.original === 'g-map') {
          let program = node.program;

          let children = program.body,
            blockParam = program.blockParams;

          if (hasCanvas(children, blockParam)) {
            return;
          }

          // No need to parse classNames; we pass them via the component.

          let canvas = b.mustache(b.path(`${blockParam}.canvas`));

          children.unshift(canvas);
        }
      },

      ElementNode(node) {
        if (node.tag === 'GMap' || node.tag === 'g-map') {
          // Self-closing tag
          if (node.selfClosing) {
            return;
          }

          let children = node.children,
            blockParam = node.blockParams[0];

          if (hasCanvas(children, blockParam)) {
            return;
          }

          let attributes = new Map(
            node.attributes
              .filter(({ name }) => name.charAt(0) !== '@')
              .map((a) => [a.name, a])
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
              selfClosing: true,
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
      },
    };

    this.syntax.traverse(ast, visitor);

    return ast;
  }
}

function hasCanvas(nodes, blockParam) {
  for (let node of nodes) {
    // Glimmer
    if (node.type === 'ElementNode' && node.tag === `${blockParam}.canvas`) {
      return true;
    }

    // Mustache component
    if (node.type === 'MustacheStatement' && node.path.parts[1] === 'canvas') {
      return true;
    }
  }

  return false;
}

module.exports = CanvasEnforcer;
