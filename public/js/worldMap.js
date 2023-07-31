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
    $('.mapboxgl-ctrl-top-left').append(`
<div class="mapboxgl-ctrl mapboxgl-ctrl-group">

<div class="dropdown">
  <button class="dropbtn" style="width: 60px; font-size: 12px;background-color: #337795;">Base Map</button>
  <div class="dropdown-content">
  <div id="menu" style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;">

<div style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;">
<input id="os" type="radio" name="rtoggle" value="os" checked="checked" onClick="javascript:map.setLayoutProperty('googlehybrid', 'visibility', 'none'); map.setLayoutProperty('googlesatellite', 'visibility', 'none'); map.setLayoutProperty('osmstreet', 'visibility', 'none');">
<label for="os">Ordnance Survey</label>
</div>

<div style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;">
<input id="osmstreet" type="radio" name="rtoggle" value="osmstreet" onClick="javascript:map.setLayoutProperty('googlehybrid', 'visibility', 'none'); map.setLayoutProperty('googlesatellite', 'visibility', 'none'); map.setLayoutProperty('osmstreet', 'visibility', 'visible');">
<label for="osmstreet">OpenStreetMap Street</label>
</div>

<div style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;">
<input id="satellite" type="radio" name="rtoggle" value="satellite" onClick="javascript:map.setLayoutProperty('googlehybrid', 'visibility', 'none'); map.setLayoutProperty('googlesatellite', 'visibility', 'visible'); map.setLayoutProperty('osmstreet', 'visibility', 'none');">
<label for="satellite">Google Satellite</label>
</div>

<div style="display: flex;flex-direction: row;justify-content: center;align-items: flex-start;">
<input id="hybrid" type="radio" name="rtoggle" value="hybrid" onClick="javascript:map.setLayoutProperty('googlehybrid', 'visibility', 'visible'); map.setLayoutProperty('googlesatellite', 'visibility', 'none'); map.setLayoutProperty('osmstreet', 'visibility', 'none');">
<label for="hybrid">Google Hybrid</label>
</div>

</div>
  </div>
</div>


</div>
`);

    map.setFog({
        'color': 'rgb(255, 255, 255)',
        'high-color': 'rgb(55, 187, 232)',
        'horizon-blend': 0.2
    });

    map.addLayer({
        'id': 'googlehybrid',
        'type': 'raster',
        'source': {
            'type': 'raster',
            'tiles': [
                'https://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'
            ],
            'tileSize': 128,
            'layout': {
                'visibility': 'none'
            }
        }
    });
    map.addLayer({
        'id': 'googlesatellite',
        'type': 'raster',
        'source': {
            'type': 'raster',
            'tiles': [
                'https://mt1.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}'
            ],
            'tileSize': 128,
            'layout': {
                'visibility': 'none'
            }
        }
    });
    map.addLayer({
        'id': 'osmstreet',
        'type': 'raster',
        'source': {
            'type': 'raster',
            'tiles': [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            'tileSize': 128,
            'layout': {
                'visibility': 'none'
            }
        }
    });

    map.setLayoutProperty('googlehybrid', 'visibility', 'none');
    map.setLayoutProperty('googlesatellite', 'visibility', 'none');
    map.setLayoutProperty('osmstreet', 'visibility', 'none');

    map.addLayer({
        "id": "OS/TopographicArea_2/Building/1_3D",
        "type": "fill-extrusion",
        "source": "esri",
        "source-layer": "TopographicArea_2",
        "filter": ["==", "_symbol", 4],
        "minzoom": 15,
        "layout": {
            "visibility": "visible"
        },
        "paint": {
            "fill-extrusion-color": "#DCD7C6",
            "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "RelHMax"]
            ],
            "fill-extrusion-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                16,
                0.9
            ]
        },
        'filter': ["all", ["!=", "TOID", "test"]]
    });
    map.addLayer({
        "id": "OS/TopographicArea_2/Building/1_3D_high",
        "type": "fill-extrusion",
        "source": "esri",
        "source-layer": "TopographicArea_2",
        "filter": ["==", "_symbol", 4],
        "minzoom": 15,
        "layout": {
            "visibility": "visible"
        },
        "paint": {
            "fill-extrusion-color": "#993a3a",
            "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "RelHMax"]
            ],
            "fill-extrusion-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                16,
                0.9
            ]
        },
        'filter': ['in', 'TOID', '']
    });

    var filterbuildings = ["all", ["!=", "TOID", "test"]];

    for (var i = 0; i < (parsed3dbuildings.features).length; i++) {
        filterbuildings.push(["!=", "TOID", parsed3dbuildings.features[i].properties.TOID]);
        parsed3dbuildings.features[i].properties.RelHMax = parseFloat(parsed3dbuildings.features[i].properties.RelHMax);
    }

    map.setFilter('OS/TopographicArea_2/Building/1_3D', filterbuildings);

    map.addSource('new3Dbuildings', {
        type: 'geojson',
        data: parsed3dbuildings
    });
    map.addLayer({
        "id": "new3Dbuildings",
        "type": "fill-extrusion",
        "source": "new3Dbuildings",
        "minzoom": 15,
        "layout": {
            "visibility": "visible"
        },
        "paint": {
            "fill-extrusion-color": "#3ec4b9",
            "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "RelHMax"]
            ],
            "fill-extrusion-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                16,
                0.9
            ]
        }
    });

    map.on('click', 'OS/TopographicArea_2/Building/1_3D', (e) => {

        map.setFilter('OS/TopographicArea_2/Building/1_3D_high', ['in', 'TOID', e.features[0].properties.TOID]);
        draw.deleteAll();
        map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D', 'visibility', 'none');
        map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D_high', 'visibility', 'none');
        draw.add(e.features[0]);


        $('#insideinfo').css('display', 'block');

        $('#discardbutton').click(function () {
            $('#insideinfo').css('display', 'none');
            draw.deleteAll();
            map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D', 'visibility', 'visible');
            map.setFilter('OS/TopographicArea_2/Building/1_3D_high', ['in', 'TOID', '']);
            map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D_high', 'visibility', 'visible');
        });

        $('#savebutton').click(async function () {
            $('#insideinfo').css('display', 'none');
            (parsed3dbuildings.features).push(draw.getAll().features[0]);

            const feature = draw.getAll();

            // $.post('/3DBuildings_edited/edit.php', {
            // 	data: parsed3dbuildings
            // });

            map.getSource('new3Dbuildings').setData(parsed3dbuildings);
            filterbuildings.push(["!=", "TOID", draw.getAll().features[0].properties.TOID]);
            map.setFilter('OS/TopographicArea_2/Building/1_3D', filterbuildings);
            map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D', 'visibility', 'visible');
            map.setFilter('OS/TopographicArea_2/Building/1_3D_high', ['in', 'TOID', '']);
            map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D_high', 'visibility', 'visible');
            draw.deleteAll();

            console.log("-------");
            console.log(feature)
            try {ss
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                const raw = JSON.stringify({
                    "osid": feature.features[0].id,
                    "toid": feature.features[0].properties.TOID,
                    "symbol": feature.features[0].properties._symbol,
                    "height_max": feature.features[0].properties.RelHMax,
                    "geom": feature.features[0].geometry
                });
                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                };
                const response = fetch('https://buildingshistory.co.uk/api/v1/geo', requestOptions)
                const data = response.json();
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        });

        $('#uploadbutton').click(async function () {
            $('#insideinfo').css('display', 'none');
            (parsed3dbuildings.features).push(draw.getAll().features[0]);

            const feature = draw.getAll();

            // $.post('./3DBuildings_edited/edit.php', {
            // 	data: parsed3dbuildings
            // });

            map.getSource('new3Dbuildings').setData(parsed3dbuildings);
            filterbuildings.push(["!=", "TOID", draw.getAll().features[0].properties.TOID]);
            map.setFilter('OS/TopographicArea_2/Building/1_3D', filterbuildings);
            map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D', 'visibility', 'visible');
            map.setFilter('OS/TopographicArea_2/Building/1_3D_high', ['in', 'TOID', '']);
            map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D_high', 'visibility', 'visible');
            draw.deleteAll();

            console.log("-------");
            console.log(feature)
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                const raw = JSON.stringify({
                    "osid": feature.features[0].id,
                    "toid": feature.features[0].properties.TOID,
                    "symbol": feature.features[0].properties._symbol,
                    "height_max": feature.features[0].properties.RelHMax,
                    "geom": feature.features[0].geometry
                });
                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                };
                const response = fetch('https://buildingshistory.co.uk/api/v1/geo/upload', requestOptions)
                const data = response.json();
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        });

    });

    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    }), 'top-right');
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');


    map.addControl(draw);


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

    const imgLocations = [];
    coordinatesArray.forEach(function (coordinate, index) {
        latitude = coordinate[0]
        longitude = coordinate[1]

        Bearingofcamera = coordinate[4];
        Atitudeofcamera = coordinate[5];
        URLofcamera = coordinate[2];

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

        imgLocations.push({
            coordinates: [longitude, latitude]
        })

        // map.addLayer({
        //     id: 'custom_layer' + index,
        //     type: 'custom',
        //     renderingMode: '3d',
        //     onAdd: function (map, mbxContext) {
        //         window.tb = new Threebox(map, mbxContext, {
        //             defaultLights: true
        //         });

        //         var options = {
        //             type: 'gltf',
        //             obj: assetUrl + 'kamera.gltf',
        //             units: 'meters',
        //             scale: 0.05,
        //             rotation: {
        //                 x: 90,
        //                 y: -coordinate[4],
        //                 z: 0
        //             },
        //             adjustment: {
        //                 x: 0,
        //                 y: 0,
        //                 z: 0
        //             },
        //             anchor: 'center',
        //             coords: [coordinate[1], coordinate[0]],
        //             tooltip: true
        //         }
        //         tb.loadObj(options, function (model) {
        //             model.setCoords(options.coords);
        //             tb.add(model);
        //         });

        //     },
        //     render: function (gl, matrix) {
        //         tb.update();
        //     }
        // });

        // map.setLayerZoomRange('custom_layer' + index, 19, 30);

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

    console.log(imgLocations)
    const ICON_MAPPING = {
        marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
    };
    const deckOverlay = new deck.MapboxOverlay({
        layers: [
            new deck.IconLayer({
            id: 'IconLayer',
            data: imgLocations,
            
            /* props from IconLayer class */
            
            // alphaCutoff: 0.05,
            // billboard: true,
            // getAngle: 0,
            getColor: d => [Math.sqrt(d.exits), 140, 0],
            getIcon: d => 'marker',
            // getPixelOffset: [0, 0],
            getPosition: d => d.coordinates,
            getSize: d => 5,
            iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
            iconMapping: {
                marker: {
                x: 0,
                y: 0,
                width: 128,
                height: 128,
                anchorY: 128,
                mask: true
                }
            },
            // onIconError: null,
            // sizeMaxPixels: Number.MAX_SAFE_INTEGER,
            // sizeMinPixels: 0,
            sizeScale: 8,
            // sizeUnits: 'pixels',
            // textureParameters: null,
            
            /* props inherited from Layer class */
            
            // autoHighlight: false,
            // coordinateOrigin: [0, 0, 0],
            // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
            // highlightColor: [0, 0, 128, 128],
            // modelMatrix: null,
            // opacity: 1,
            pickable: true,
            // visible: true,
            // wrapLongitude: false,
            })
    ]
    });
    map.addControl(deckOverlay);

    map.loadImage(assetUrl + '/camera.png', (error, image) => {
        if (error) throw error;
        map.addImage('camera-icon', image, {
            'sdf': true
        });
        map.addSource('newExifcamera', {
            'type': 'geojson',
            'data': newExifcamera,
            'generateId': true
        });
        map.addLayer({
            'id': 'newExifcamera',
            'source': 'newExifcamera',
            'type': 'symbol',
            'layout': {
                'icon-image': 'camera-icon',
                'icon-size': 0.1,
                'icon-rotate': ['get', 'Bearing'],
                'icon-pitch-alignment': 'map',
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true
            },
            'paint': {
                'icon-color': '#cb18e2'
            },
            'maxzoom': 19
        });

        let newExifcameraCallback1 = (e) => {
            map.getCanvas().style.cursor = 'pointer';
            coordinates = e.features[0].geometry.coordinates.slice();
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            whattoshow = `
<img src="/galleries/${e.features[0].properties.URL}" alt="Click to view full image" width="240" height="240"><br>
<b>Altitude:</b> ${(e.features[0].properties.Altitude).toFixed(2)}m<br>
<b>Heading:</b> ${(e.features[0].properties.Bearing).toFixed(2)}°<br>
`;
            popup.setLngLat(coordinates).setHTML(whattoshow).addTo(map);
        };
        map.on('mouseenter', 'newExifcamera', newExifcameraCallback1);
        // map.on('touchstart', 'newExifcamera', newExifcameraCallback1);

        let newExifcameraCallback2 = () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        };
        map.on('mouseleave', 'newExifcamera', newExifcameraCallback2);
        // map.on('touchend', 'newExifcamera', newExifcameraCallback2);

        map.on('click', 'newExifcamera', (e) => {
            map.getCanvas().style.cursor = 'pointer';
            coordinates = e.features[0].geometry.coordinates.slice();
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            popupMappics.setLngLat(coordinates).setHTML(e.features[0].properties.popup_html).addTo(map);
        });


    });

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
            'fill-extrusion-color': "#48C6EF",
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
            'fill-extrusion-color': "#48C6EF",
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