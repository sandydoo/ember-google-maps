export function toLatLng(lat, lng) {
  return lat && lng && google.maps ? new google.maps.LatLng(lat, lng) : undefined;
}
