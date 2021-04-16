export function trigger(component, eventName, ...options) {
  google.maps.event.trigger(component, eventName, ...options);
}

export function getDirectionsQuery(directions) {
  let { origin, destination } = directions.request;
  return { origin: origin.query, destination: destination.query };
}
