var imageMap = document.getElementById('imageMap');
// var map = L.map('imageMap').setView([imageMap.dataset.latitude, imageMap.dataset.longitude], 17);
var mapboxApiKey = imageMap.dataset.mapboxapikey;

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: 'mapbox/streets-v10',
//     accessToken: mapboxApiKey
// }).addTo(map);

// L.marker([imageMap.dataset.latitude, imageMap.dataset.longitude]).addTo(map);

imageMapbox = new mapboxgl.Map({
    container: 'imageMap',
    style: 'mapbox://styles/mapbox/satellite-streets-v12?key=' + mapboxApiKey,
    // center: [imageMap.dataset.longitude, imageMap.dataset.latitude],
    zoom: 16.5,
    // maxPitch: 85,
    // pitch: 37,
    // bearing: -63.4,
    // antialias: true,
    // maxZoom: 18,
    transformRequest: (url, resourceType) => {
        if (resourceType !== 'Image' && !url.includes('google') && !url.includes('openstreet') && !url.includes('opentopo') && !url.includes('osmbuildings') && !url.includes('edited3Dbuildings')) {
            return {
                url: url + '&srs=3857'
            }
        }
    }
});
imageMapbox.on('load', async () => {
    await new mapboxgl.Marker()
        .setLngLat([imageMap.dataset.longitude, imageMap.dataset.latitude])
        .addTo(imageMapbox)

    await imageMapbox.setCenter([imageMap.dataset.longitude, imageMap.dataset.latitude]);
});