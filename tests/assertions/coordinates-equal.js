export default function coordinatesEqual(latLng1, latLng2, message = '') {
  let isEqual = false;

  if (!latLng1) {
    message = 'First location was null';
  } else if (!latLng2) {
    message = 'Second location was null';
  } else if (latLng1.lat !== latLng2.lat) {
    message = `Latitude ${latLng1.lat} did not match ${latLng2.lat}`;
  } else if (latLng1.lng !== latLng2.lng) {
    message = `Longitude ${latLng1.lng} did not match ${latLng2.lng}`;
  } else {
    isEqual = true;
  }

  this.pushResult({
    result: isEqual,
    actual: latLng1,
    expected: latLng2,
    message: message
  });
}