import { bind } from '@ember/runloop';

export default function() {
  const trigger = google.maps.event.trigger;
  google.maps.event.trigger = bind(google.maps.event, trigger);

  const addListener = google.maps.event.addListener;
  google.maps.event.addListener = function(element, event, func) {
    let newFunc = bind(element, func);
    return addListener.apply(this, [element, event, newFunc]);
  }

  const addListenerOnce = google.maps.event.addListenerOnce;
  google.maps.event.addListenerOnce = function(element, event, func) {
    let newFunc = bind(element, func);
    return addListenerOnce.apply(this, [element, event, newFunc]);
  }
}
