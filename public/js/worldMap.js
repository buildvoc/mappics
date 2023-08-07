var mapElement = document.getElementById('map');
var mapboxApiKey = mapElement.dataset.mapboxapikey;
var parsed3dbuildings = JSON.parse(mapElement.dataset.buildings);
// var imgcontents = JSON.parse(mapElement.dataset.imgcontentarray);

$('.info').css('top', '0');
$('.info').css('left', '30%');

var draw = new MapboxDraw({
    displayControlsDefault: false
});

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

const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    maxWidth: '500px'
});

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

map.on('load', async () => {
    
    // Section 1 - Setup different map modes
    const mapModes = new MapModes(map);
    mapModes.addBaseMapControl();
    mapModes.setFog();
    mapModes.addBaseMapLayers();

    // Section 2 - Setup 3D buildings
    const mapLayers = new MapLayers(map, parsed3dbuildings);
    mapLayers.addLayers();

    // Section 3 - Map editing
    const mapHandler = new MapHandler(map, draw);

    // Section 4 - Map controls
    const mapControls = new MapControls(map);

    // Section 5 - Images on map
    var pointsdata = {
        'type': 'FeatureCollection',
        'features': []
    }

    var fieldview = {
        'type': 'FeatureCollection',
        'features': []
    }

    var polygondata = {
        'type': 'FeatureCollection',
        'features': []
    }

    var linesdata = {
        'type': 'FeatureCollection',
        'features': []
    }

    for (var i = 0; i < geojsoncontents.length; i++) {
        content = JSON.parse(geojsoncontents[i]);
        for (var o = 0; o < content.features.length; o++) {
            if (content.features[o].geometry.type === "Point") {
                pointsdata['features'].push(content.features[o]);
            } else if (content.features[o].geometry.type === "Polygon") {
                polygondata['features'].push(content.features[o]);
            } else if (content.features[o].geometry.type === "LineString") {
                linesdata['features'].push(content.features[o]);
            }
        }
    }


    var newExifcamera = {
        'type': 'FeatureCollection',
        'features': []
    }

    var fieldofview3D = {
        'type': 'FeatureCollection',
        'features': []
    }

    var fieldofview3Dcontent = {
        'type': 'FeatureCollection',
        'features': []
    }

    const imgInfoArray = [];
    coordinatesArray.forEach(function (coordinate, index) {
        latitude = coordinate[0]
        longitude = coordinate[1]

        Bearingofcamera = coordinate[4];
        Atitudeofcamera = coordinate[5];
        URLofcamera = coordinate[2];
        clickPop = coordinate[3];
        f = coordinate[9];
        fquiv = (coordinate[9] * 35) / coordinate[8];

        FOV = (2 * Math.atan(fquiv / (2 * f))) * (180 / Math.PI);

        newExifcamera['features'].push({
            type: 'Feature',
            geometry: {
                coordinates: [coordinate[1], coordinate[0]],
                type: 'Point'
            },
            properties: {
                Bearing: coordinate[4],
                URL: coordinate[2],
                AOV: FOV,
                Altitude: coordinate[5],
                'popup_html': coordinate[3]
            }
        });

        const imgInfo = {
            URL: coordinate[2],
            altitude: coordinate[5],
            coordinates: [longitude, latitude],
            bearing: Bearingofcamera,
            'popup_html': clickPop
        }
        imgInfoArray.push(imgInfo);

        newExifcamera['features'].push({
            type: 'Feature',
            geometry: {
                coordinates: [longitude, latitude],
                type: 'Point'
            },
            properties: {
                Bearing: coordinate[4],
                URL: coordinate[2],
                AOV: FOV,
                Altitude: coordinate[5]
            }
        })

        originalpoint = turf.point([longitude, latitude]);
        destination = turf.destination(originalpoint, '0.003', coordinate[4], {
            units: 'kilometers'
        });

        cameraPoint = [longitude, latitude]
        targetPoint = destination.geometry.coordinates;

        points = {
            type: 'Feature',
            properties: {
                angle: FOV
            },
            geometry: {
                type: 'GeometryCollection',
                geometries: [{
                    type: 'Point',
                    coordinates: cameraPoint
                },
                    {
                        type: 'Point',
                        coordinates: targetPoint
                    }
                ]
            }
        }

        options = {
            draggable: true
        }

        FOVresult = L.geotagPhoto.camera(points, options).getFieldOfView();

        fieldview['features'].push({
            type: 'Feature',
            geometry: {
                coordinates: [FOVresult.geometry.geometries[1].coordinates[0], cameraPoint, FOVresult.geometry.geometries[1].coordinates[1]],
                type: 'LineString'
            }
        })

        firstline = turf.lineString([cameraPoint, FOVresult.geometry.geometries[1].coordinates[0]]);
        secondline = turf.lineString([cameraPoint, FOVresult.geometry.geometries[1].coordinates[1]]);

        firstlinechunk = turf.lineChunk(firstline, 0.00001, {
            units: 'kilometers'
        });
        secondlinechunk = turf.lineChunk(secondline, 0.00001, {
            units: 'kilometers'
        });
        /*
        for (var i = 0; i < firstlinechunk.features.length; i++) {
        fieldofview3D['features'].push({type: 'Feature', geometry: {coordinates: [[ firstlinechunk.features[i].geometry.coordinates[0], secondlinechunk.features[i].geometry.coordinates[0], secondlinechunk.features[i].geometry.coordinates[1], firstlinechunk.features[i].geometry.coordinates[1]]], type:'Polygon'}, properties: {height: i/130, base:firstlinechunk.features.length/130}})
        }
        */
        for (var i = 0; i < firstlinechunk.features.length; i++) {
            parralellineforfirst = turf.lineChunk(turf.lineString([firstlinechunk.features[i].geometry.coordinates[0], secondlinechunk.features[i].geometry.coordinates[0]]), 0.00002, {
                units: 'kilometers'
            });
            parralellineforsecond = turf.lineChunk(turf.lineString([firstlinechunk.features[i].geometry.coordinates[1], secondlinechunk.features[i].geometry.coordinates[1]]), 0.00002, {
                units: 'kilometers'
            });
            fieldofview3D['features'].push({
                type: 'Feature',
                geometry: {
                    coordinates: [
                        [firstlinechunk.features[i].geometry.coordinates[0], parralellineforfirst.features[0].geometry.coordinates[1], parralellineforsecond.features[0].geometry.coordinates[1], firstlinechunk.features[i].geometry.coordinates[1]]
                    ],
                    type: 'Polygon'
                },
                properties: {
                    height: (i + 130) / 130,
                    base: (i + 131) / 130
                }
            })
            fieldofview3D['features'].push({
                type: 'Feature',
                geometry: {
                    coordinates: [
                        [secondlinechunk.features[i].geometry.coordinates[0], parralellineforfirst.features[parralellineforfirst.features.length - 1].geometry.coordinates[0], parralellineforsecond.features[parralellineforsecond.features.length - 1].geometry.coordinates[0], secondlinechunk.features[i].geometry.coordinates[1]]
                    ],
                    type: 'Polygon'
                },
                properties: {
                    height: (i + 130) / 130,
                    base: (i + 131) / 130
                }
            })
            fieldofview3D['features'].push({
                type: 'Feature',
                geometry: {
                    coordinates: [
                        [firstlinechunk.features[i].geometry.coordinates[0], parralellineforfirst.features[0].geometry.coordinates[1], parralellineforsecond.features[0].geometry.coordinates[1], firstlinechunk.features[i].geometry.coordinates[1]]
                    ],
                    type: 'Polygon'
                },
                properties: {
                    height: (-i + 370) / 370,
                    base: (-i + 370) / 370
                }
            })
            fieldofview3D['features'].push({
                type: 'Feature',
                geometry: {
                    coordinates: [
                        [secondlinechunk.features[i].geometry.coordinates[0], parralellineforfirst.features[parralellineforfirst.features.length - 1].geometry.coordinates[0], parralellineforsecond.features[parralellineforsecond.features.length - 1].geometry.coordinates[0], secondlinechunk.features[i].geometry.coordinates[1]]
                    ],
                    type: 'Polygon'
                },
                properties: {
                    height: (-i + 370) / 370,
                    base: (-i + 370) / 370
                }
            })
            fieldofview3Dcontent['features'].push({
                type: 'Feature',
                geometry: {
                    coordinates: [
                        [firstlinechunk.features[i].geometry.coordinates[0], secondlinechunk.features[i].geometry.coordinates[0], secondlinechunk.features[i].geometry.coordinates[1], firstlinechunk.features[i].geometry.coordinates[1]]
                    ],
                    type: 'Polygon'
                },
                properties: {
                    height: (-i + 370) / 370,
                    base: (i + 130) / 130,
                    Bearing: Bearingofcamera,
                    URL: '/galleries/' + URLofcamera,
                    Altitude: Atitudeofcamera
                }
            })
        }
    })

    console.log(imgInfoArray)
    const exifCameraLayer = new deck.IconLayer({
        id: 'IconLayer',
        data: imgInfoArray,
        getIcon: (d) => 'marker',
        getPosition: d => d.coordinates,
        getColor: (d) => [203, 24, 226],
        getSize: (d) => 2,
        getAngle: (d) => - d.bearing, // negative of bearing as deck.gl uses counter clockwise rotations.
        iconAtlas: assetUrl + '/camera.png',
        iconMapping: {
            marker: {
            x: 0,
            y: 0,
            width: 100,
            height: 167,
            // anchorY: 128,
            mask: true,
            },
        },
        sizeScale: 8,
        billboard: false,
        pickable: true,
        onHover: handleHover,
        onClick: handleClick,
        });
    
        const exifCameraDeckOverlay = new deck.MapboxOverlay({
            layers: [exifCameraLayer],
        });

        const deckglMrkerLayer = new deck.IconLayer({
            id: 'IconLayer',
            data: imgInfoArray,
            getIcon: (d) => 'marker',
            iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
            iconMapping: {
                marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
            },
            getPosition: d => d.coordinates,
            getColor: d => [Math.sqrt(d.exits), 140, 0],
            getSize: d => 5,
            // getAngle: (d) => - d.bearing, // negative of bearing as deck.gl uses counter clockwise rotations.
            sizeScale: 8,
            billboard: true,
            pickable: true,
            onHover: handleHover,
            });
        
            const markerLayerdeckOverlay = new deck.MapboxOverlay({
                layers: [deckglMrkerLayer],
            });
    
        function handleHover(info) {
            const { x, y, object } = info;
            const tooltipElement = document.getElementById('custom-tooltip');
            const cardElement = document.getElementById('custom-card');
            map.getCanvas().style.cursor = 'pointer';
            if (object) {
    
                const tooltipContent = `
                <img src="/galleries/${object.URL}" alt="Click to view full image">
                <br>
                <b>Altitude:</b> ${object.altitude.toFixed(2)}m
                <br>
                <b>Heading:</b> ${object.bearing.toFixed(2)}°
                `;
                coordinates = info.coordinate;
                while (Math.abs(info.viewport.longitude - coordinates[0]) > 180) {
                    coordinates[0] += info.viewport.longitude > coordinates[0] ? 360 : -360;
                }
                
                console.log(tooltipElement)
                tooltipElement.innerHTML = tooltipContent;
                tooltipElement.style.display = 'block';
                tooltipElement.style.left = x + 'px';
                tooltipElement.style.top = y + 'px';
                tooltipElement.style.color = 0x000;

                tooltipElement.style.zIndex = 999;
                
            } else {
                map.getCanvas().style.cursor = '';
                tooltipElement.style.display = 'none';
            }
        }
        
        function handleClick(info){
            const { x, y, object } = info;
            map.getCanvas().style.cursor = 'pointer';
            const cardElement = document.getElementById('custom-card');

            console.log(object.popup_html)

            if (object) {
                coordinates = info.coordinate;
                while (Math.abs(info.viewport.longitude - coordinates[0]) > 180) {
                    coordinates[0] += info.viewport.longitude > coordinates[0] ? 360 : -360;
                }

                cardElement.innerHTML = object.popup_html;
                cardElement.style.display = 'block';
                cardElement.style.left = x + 'px';
                cardElement.style.top = y + 'px';
                cardElement.style.color = 0x000;

                cardElement.style.zIndex = 999;
            } else {
                map.getCanvas().style.cursor = '';
                cardElement.style.display = 'none';
            }
        }


        map.addControl(exifCameraDeckOverlay);
        map.addControl(markerLayerdeckOverlay);

//     map.loadImage(assetUrl + '/camera.png', (error, image) => {
//         if (error) throw error;
//         map.addImage('camera-icon', image, {
//             'sdf': true
//         });
//         map.addSource('newExifcamera', {
//             'type': 'geojson',
//             'data': newExifcamera,
//             'generateId': true
//         });
//         map.addLayer({
//             'id': 'newExifcamera',
//             'source': 'newExifcamera',
//             'type': 'symbol',
//             'layout': {
//                 'icon-image': 'camera-icon',
//                 'icon-size': 0.1,
//                 'icon-rotate': ['get', 'Bearing'],
//                 'icon-pitch-alignment': 'map',
//                 'icon-rotation-alignment': 'map',
//                 'icon-allow-overlap': true
//             },
//             'paint': {
//                 'icon-color': '#cb18e2'
//             },
//             'maxzoom': 19
//         });

//         let newExifcameraCallback1 = (e) => {
//             map.getCanvas().style.cursor = 'pointer';
//             coordinates = e.features[0].geometry.coordinates.slice();
//             while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//                 coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//             }
//             whattoshow = `
// <img src="/galleries/${e.features[0].properties.URL}" alt="Click to view full image" width="240" height="240"><br>
// <b>Altitude:</b> ${(e.features[0].properties.Altitude).toFixed(2)}m<br>
// <b>Heading:</b> ${(e.features[0].properties.Bearing).toFixed(2)}°<br>
// `;
//             popup.setLngLat(coordinates).setHTML(whattoshow).addTo(map);
//         };
//         map.on('mouseenter', 'newExifcamera', newExifcameraCallback1);
//         // map.on('touchstart', 'newExifcamera', newExifcameraCallback1);

//         let newExifcameraCallback2 = () => {
//             map.getCanvas().style.cursor = '';
//             popup.remove();
//         };
//         map.on('mouseleave', 'newExifcamera', newExifcameraCallback2);
//         // map.on('touchend', 'newExifcamera', newExifcameraCallback2);

//         map.on('click', 'newExifcamera', (e) => {    
//             map.getCanvas().style.cursor = 'pointer';
//             coordinates = e.features[0].geometry.coordinates.slice();
//             while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//                 coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//             }

//             popupMappics.setLngLat(coordinates).setHTML(e.features[0].properties.popup_html).addTo(map);
//         });


//     });

    map.addSource('fieldview', {
        'type': 'geojson',
        'data': fieldview,
        'generateId': true
    });


    map.addSource('fieldofview3D', {
        'type': 'geojson',
        'data': fieldofview3D,
        'generateId': true
    });
    map.addSource('fieldofview3Dcontent', {
        'type': 'geojson',
        'data': fieldofview3Dcontent,
        'generateId': true
    });
    map.addSource('polygondata', {
        'type': 'geojson',
        'data': polygondata,
        'generateId': true
    });
    map.addSource('linesdata', {
        'type': 'geojson',
        'data': linesdata,
        'generateId': true
    });


    map.addLayer({
        'id': 'fieldofview3D',
        'type': 'fill-extrusion',
        'source': 'fieldofview3D',
        'paint': {
            'fill-extrusion-color': "#CB1AE2",
            'fill-extrusion-height': ['get', 'base'],
            'fill-extrusion-base': ['get', 'height'],
            'fill-extrusion-opacity': 0.6
        }
    });
    map.addLayer({
        'id': 'fieldofview3Dcontent',
        'type': 'fill-extrusion',
        'source': 'fieldofview3Dcontent',
        'paint': {
            'fill-extrusion-color': "#CB1AE2",
            'fill-extrusion-height': ['get', 'base'],
            'fill-extrusion-base': ['get', 'height'],
            'fill-extrusion-opacity': 0.05
        }
    });

    let fieldofview3DcontentCallback1 = (e) => {
        map.getCanvas().style.cursor = 'pointer';

        whattoshow = `
<img src="${e.features[0].properties.URL}" alt="Click to view full image" width="240" height="240"><br>
<b>Altitude:</b> ${(e.features[0].properties.Altitude).toFixed(2)}m<br>
<b>Heading:</b> ${(e.features[0].properties.Bearing).toFixed(2)}°<br>
`;
        popup.setLngLat(e.lngLat).setHTML(whattoshow).addTo(map);
    };
    map.on('mouseenter', 'fieldofview3Dcontent', fieldofview3DcontentCallback1);
    // map.on('touchstart', 'fieldofview3Dcontent', fieldofview3DcontentCallback1);

    let fieldofview3DcontentCallback2 = () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    };
    map.on('mouseleave', 'fieldofview3Dcontent', fieldofview3DcontentCallback2);
    // map.on('touchend', 'fieldofview3Dcontent', fieldofview3DcontentCallback2);

    map.addLayer({
        'id': 'polygondata_fill',
        'type': 'fill',
        'source': 'polygondata',
        'paint': {
            'fill-color': '#ffffff',
            'fill-opacity': 0.1
        },
        'layout': {
            'visibility': 'visible'
        },
    });

    map.addLayer({
        'id': 'polygondata_outline',
        'type': 'line',
        'source': 'polygondata',
        'layout': {},
        'paint': {
            'line-color': '#fff',
            'line-width': 1
        }
    });

    map.addLayer({
        'id': 'linesdata',
        'type': 'line',
        'source': 'linesdata',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#000',
            'line-width': 2
        }
    });

    // const geoJSONHandler = new GeoJSONHandler(geojsoncontents, coordinatesArray, map, turf, deck, assetUrl);
    // geoJSONHandler.processGeoJSONData();

    // Section 6
    map.loadImage(assetUrl + 'triangle.png', (error, image) => {
        if (error) throw error;
        map.addImage('triangle-icon', image, {
            'sdf': true
        });
        map.addSource('pointsdata', {
            'type': 'geojson',
            'data': pointsdata,
            'generateId': true
        });
        map.addLayer({
            'id': 'pointsdata',
            'source': 'pointsdata',
            'type': 'symbol',
            'layout': {
                'icon-image': 'triangle-icon',
                'icon-size': 0.1,
                'icon-allow-overlap': true
            },
            'paint': {
                'icon-color': '#156ad3'
            }
        });

        let triangleCallback1 = (e) => {
            map.getCanvas().style.cursor = 'pointer';
            coordinates = e.features[0].geometry.coordinates.slice();
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            whattoshow = ``;

            propertieskeys = Object.keys(e.features[0].properties);
            for (let i = 0; i < propertieskeys.length; i++) {
                if ((e.features[0].properties[propertieskeys[i]]).includes('http')) {
                    whattoshow = whattoshow + `<b>${propertieskeys[i].toUpperCase()}:</b> <a href="${e.features[0].properties[propertieskeys[i]]}" target="_blank">Click to see link</a><br>`
                } else {
                    whattoshow = whattoshow + `<b>${propertieskeys[i].toUpperCase()}:</b> ${e.features[0].properties[propertieskeys[i]]}<br>`
                }
            }


            popup.setLngLat(coordinates).setHTML(whattoshow).addTo(map);

        };
        map.on('mouseenter', 'pointsdata', triangleCallback1);
        // map.on('touchstart', 'pointsdata', triangleCallback1);

        let triangleCallback2 = () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        };
        map.on('mouseleave', 'pointsdata', triangleCallback2);
        map.on('touchend', 'pointsdata', triangleCallback2);


        map.on('click', 'pointsdata', (e) => {
            coordinates = e.features[0].geometry.coordinates.slice();
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            whattoshow = `<div style="background-color: #8b8282; color:white; padding-left: 5px; margin-bottom: 5px; display: flex;flex-direction: row;align-items: center;justify-content: space-between"><div>List Entry</div><button style="position:relative; color:white" class="mapboxgl-popup-close-button" type="button" aria-label="Close popup" onClick="popup1.remove();">×</button></div>`;

            propertieskeys = Object.keys(e.features[0].properties);
            for (let i = 0; i < propertieskeys.length; i++) {
                if ((e.features[0].properties[propertieskeys[i]]).includes('http')) {
                    whattoshow = whattoshow + `<b>${propertieskeys[i].toUpperCase()}:</b> <a href="${e.features[0].properties[propertieskeys[i]]}" target="_blank">Click to see link</a><br>`
                } else {
                    whattoshow = whattoshow + `<b>${propertieskeys[i].toUpperCase()}:</b> ${e.features[0].properties[propertieskeys[i]]}<br>`
                }
            }


            popup1.setLngLat(coordinates).setHTML(whattoshow).addTo(map);

        });





    });

    $('#loading-map').css('display', 'none');
})