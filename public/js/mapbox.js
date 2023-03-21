console.log(document.getElementById('map'));

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaGFucy0xIiwiYSI6ImNsZW1hMTUxbTA1cXgzem1uMGZ6ZXpsOWUifQ.ruxPysRIuNbq4bvBc0EOog';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/hans-1/cleno4jor000301qktwjdj6df',
    scrollZoom: false
  });
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach(loc => {
    //create Marker

    const el = document.createElement('div');
    el.className = 'marker';
    //Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    //Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}:${loc.description}</p>`)
      .addTo(map);
    //Extend map bounds to include
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
};
