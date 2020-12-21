'use strict';
/* eslint-disable node/no-unpublished-require */

/**
 * # Usage
 *
 * Compile and print output:
 *
 * `node lib/sample-ast-script.js`
 *

 * Run and inspect in web tools:
 *
 * `node --inspect-brk lib/sample-ast-script.js`
 */

let compiler = require('ember-source/dist/ember-template-compiler');
compiler.registerPlugin('ast', require('./canvas-enforcer'));

let template =`
<GMap class="map-class" style="map-style" @lat="51" @lng="52" />

<GMap class="map-class" style="map-style" @lat="51" @lng="52" as |g|>
</GMap>

<GMap class="map-class" style="map-style" @lat="51" @lng="52" as |g|>
  <div class="random" style="color: red;">Random div</div>
  <g.marker @lat="51" @lng="51" />
</GMap>

{{g-map lat="51" lng="52"}}

{{#g-map lat="51" lng="52" as |g|}}
  {{g.marker lat="51" lng="51"}}
{{/g-map}}
`;

let output = compiler.precompile(template, { contents: template });
console.log(output); // eslint-disable-line no-console
