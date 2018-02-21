const sampleEvent = {
  event: null, // the event object, if present.
  eventName: 'bounds_changed', // the name of the triggered event.
  target: google.maps.marker, // the instance of the map component that triggered the event. This could be the map itself or a marker.
  map: google.maps.map, // the target component's parent map instance.
}