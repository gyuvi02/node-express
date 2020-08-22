// console.log('Welcome from the client side')

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoiZ3l1dmkwMiIsImEiOiJja2U0ano4ZXowMXQ0Mnlwb3V6em1ibmU3In0.wHnEZ4bG1t_3qG2t9AkyWA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/gyuvi02/cke4kl7ey19g41ast771ue8hg',
  scrollZoom: false
  // center: [-114.679, 32.529],
  // zoom: 5,
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});

