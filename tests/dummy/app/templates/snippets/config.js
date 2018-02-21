ENV['ember-google-maps'] = {
  key: process.env.GOOGLE_MAPS_API_KEY,
  language: 'en',
  protocol: 'https',
  version: '3.31',
  libraries: ['geometry', 'places']
  // client: ...
  // channel: ...
}