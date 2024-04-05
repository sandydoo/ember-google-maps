'use-strict';

const camelCase = require('camelcase');
const path = require('path');

const IS_COMPONENT = /components\//;

function newIncludedList(onlyList = [], exceptList = []) {
  let only = new Set(onlyList);
  let except = new Set(exceptList);

  if (except.size > 0) {
    return Array.from(difference(only, except));
  }

  return Array.from(only);
}

function newExcludedList(onlyList = [], exceptList = []) {
  let only = new Set(onlyList);
  let except = new Set(exceptList);

  if (only.size > 0) {
    return Array.from(intersection(except, only));
  }

  return Array.from(except);
}

function skipTreeshaking(included = [], excluded = []) {
  return included.length === 0 && excluded.length === 0;
}

function newExcludeName(included = [], excluded = []) {
  return function (rawName) {
    let name = camelCase(rawName);

    let isIncluded = included.includes(name);
    let isExcluded = excluded.includes(name);

    if (included.length === 0 && excluded.length === 0) {
      return false;
    }

    // Include if both included and excluded
    if (isIncluded && isExcluded) {
      return false;
    }

    // Only included
    if (included.length && excluded.length === 0) {
      return !isIncluded;
    }

    // Only excluded
    if (excluded.length && included.length === 0) {
      return isExcluded;
    }

    return !isIncluded || isExcluded;
  };
}

function newExcludeComponent(included = [], excluded = []) {
  let shouldExclude = newExcludeName(included, excluded);

  return function (name) {
    if (!IS_COMPONENT.test(name)) {
      return false;
    }

    let baseName = path.basename(name).split('.').shift();

    return shouldExclude(baseName);
  };
}

function intersection(a, b) {
  let intersection = new Set();

  for (let e of b) {
    if (a.has(e)) {
      intersection.add(e);
    }
  }

  return intersection;
}

function difference(a, b) {
  let difference = new Set(a);

  for (let e of b) {
    difference.delete(e);
  }

  return difference;
}

module.exports = {
  newExcludeName,
  newExcludeComponent,
  newIncludedList,
  newExcludedList,
  skipTreeshaking,
};
