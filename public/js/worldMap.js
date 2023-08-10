var mapElement = document.getElementById('map');
var mapboxApiKey = mapElement.dataset.mapboxapikey;
var parsed3dbuildings = JSON.parse(mapElement.dataset.buildings);
// var imgcontents = JSON.parse(mapElement.dataset.imgcontentarray);

$('.info').css('top', '0');
$('.info').css('left', '30%');

mapboxgl.accessToken = 'pk.eyJ1Ijoibm91ZmVsZ2hheWF0aSIsImEiOiJja3lmNWwwemEwOXNuMnhxcm9qNDF2ZXRhIn0.n0EDO6c611aAGh4r9-FwSg';
var map = new mapboxgl.Map({
    container: 'map',
    // style: 'https://api.os.uk/maps/vector/v1/vts/resources/styles?key=' + mapboxApiKey,
    style: 'https://api.os.uk/maps/vector/v1/vts/resources/styles?key=wCujufkC5D7bjVRTf5goHOSQSu8lLAbT',
    center: [-0.098136, 51.513813],
    zoom: 16.5,
    maxPitch: 85,
    pitch: 37,
    bearing: -63.4,
    hash: true,
    antialias: true,
    maxZoom: 21,
    transformRequest: (url, resourceType) => {
        if (resourceType !== 'Image' && !url.includes('google') && !url.includes('openstreet') && !url.includes('opentopo') && !url.includes('osmbuildings') && !url.includes('edited3Dbuildings')) {
            return {
                url: url + '&srs=3857'
            }
        }
    }
});

localStorage.setItem('name', 'ejioforched');
localStorage.getItem('name');

sessionStorage.setItem('map', 'maptiler');

// use of popup1 base.html.twig
const popup1 = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true,
    maxWidth: '500px'
});

const popupMappics = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true,
    maxWidth: '500px'
});

var assetUrl = mapElement.dataset.asseturl;
var coordinatesArray = JSON.parse(mapElement.dataset.coordinates);
var geojsoncontents = JSON.parse(mapElement.dataset.filescontentarray);

map.on('load', () => {
    const mapController = new MapController(map, parsed3dbuildings, geojsoncontents, coordinatesArray, assetUrl);
    mapController.initialize();
});
