import { bind } from '@ember/runloop';

export default function () {
  const trigger = google.maps.event.trigger;
  google.maps.event.trigger = bind(google.maps.event, trigger);
}
