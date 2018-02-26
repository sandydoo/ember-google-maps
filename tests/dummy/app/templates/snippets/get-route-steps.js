import { helper } from '@ember/component/helper';

export function getRouteSteps([directions]) {
  try {
    return directions.routes[0].legs[0].steps;
  }
  catch(error) {
    return [];
  }
}

export default helper(getRouteSteps);