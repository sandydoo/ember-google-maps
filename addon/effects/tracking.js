import { createCache, getValue } from '@glimmer/tracking/primitives/cache';
import { _backburner } from '@ember/runloop';
import { registerDestructor } from '@ember/destroyable';

// TODO Revisit when Glimmer gets effects
import Ember from 'ember';
const { untrack } = Ember.__loader.require('@glimmer/validator');

/**
 * It’s been clear since launch that Octane’s design doesn’t account for a few
 * important use-cases:
 *
 * - Data with side-effects
 * - Side-effects
 *
 * ### Data with side-effects
 *
 * A simple example is loading data from a remote source.
 *
 * Arguments changed -> Call fetch -> Return data
 *
 * “Data with side-effects” aren’t too big of an issue any more. This will
 * likely officially be solved with “resources” — Ember’s version of hooks, I
 * guess. You can already roll your own version using public APIs (createCache,
 * getValue, and custom helpers).
 *
 * ### Side-effects
 *
 * Traditional side-effects are a much bigger problem. They generally don’t
 * return anything, so there’s no value to use in the template. And it’s exactly
 * the consumption of a value in the template that triggers autotracking and
 * actually calls the effect.
 *
 * This behaviour is a massive pain for addons like this: ones that provide a
 * convenient component interface, but don’t necessarily render anything
 * directly.
 *
 * There are two (similar) workarounds at the moment:
 *
 * - ember-render-helpers
 * - {{each}} + {{get}} helpers
 *
 * In both cases, the goal is to entangle values in autotracking.
 *
 * Here’s the problem though. Both workarounds end up littering the template
 * with suspiciously imperative looking implementation logic. The each + get
 * helper method is much messier, but both methods work by consuming values you
 * want to react to.
 *
 * I can’t imagine that this will last forever, and I’d rather wait and see what
 * the official solution to side-effects will be.
 *
 * My goal here is to bridge an imperative map interface with a declarative
 * framework. I would much rather write a bit of imperative code in one place,
 * than battle Ember/Glimmer to hack side-effects into the template.
 *
 */

const EFFECTS_TO_RUN = new Set();

_backburner.on('end', () => {
  EFFECTS_TO_RUN.forEach((effect) => getValue(effect));
});

function teardownEffect(effect) {
  EFFECTS_TO_RUN.delete(effect);
}

export function setupEffect(fn) {
  let effect = createCache(fn);

  EFFECTS_TO_RUN.add(effect);
  registerDestructor(effect, teardownEffect);

  return effect;
}

export { untrack };
