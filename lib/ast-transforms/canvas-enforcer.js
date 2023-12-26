'use-strict';

function enforceCanvas(env) {
  let b = env.syntax.builders;

  let visitor = {
    BlockStatement(node) {
      if (node.path.original === 'g-map') {
        let program = node.program;

        let children = program.body,
          blockParam = program.blockParams;

        if (hasCanvas(children, blockParam)) {
          return;
        }

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
            .map((a) => [a.name, a]),
        );

        let classAttr = attributes.get('class');
        if (classAttr) {
          attributes.set('class', classAttr);
        }

        let canvas = b.element(
          {
            name: `${blockParam}.canvas`,
            selfClosing: true,
          },
          {
            attrs: Array.from(attributes.values()),
            modifiers: [],
            children: [],
            comments: undefined,
            blockParams: [],
            loc: node.loc,
          },
        );

        children.unshift(canvas);
      }
    },
  };

  return {
    name: 'canvas-enforcer',
    visitor,
  };
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

module.exports = enforceCanvas;
