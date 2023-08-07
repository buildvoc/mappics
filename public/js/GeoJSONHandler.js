class GeoJSONHandler {
  constructor(map, geojsoncontents, coordinatesArray, turf, deck, assetUrl) {
    this.geojsoncontents = geojsoncontents;
    this.coordinatesArray = coordinatesArray;
    this.map = map;
    this.turf = turf;
    this.deck = deck;
    this.assetUrl = assetUrl;

    this.addGeoJSONSourcesAndLayers();
    this.addEventListeners();

    // Initialize the feature collections
    this.pointsdata = {
      'type': 'FeatureCollection',
      'features': []
    };

    this.fieldview = {
      'type': 'FeatureCollection',
      'features': []
    };

    this.polygondata = {
      'type': 'FeatureCollection',
      'features': []
    };

    this.linesdata = {
      'type': 'FeatureCollection',
      'features': []
    };

    this.newExifcamera = {
      'type': 'FeatureCollection',
      'features': []
    };

    this.fieldofview3D = {
      'type': 'FeatureCollection',
      'features': []
    };

    this.fieldofview3Dcontent = {
      'type': 'FeatureCollection',
      'features': []
    };

    this.imgInfoArray = [];
  }

  addGeoJSONSourcesAndLayers() {
    this.map.addSource('fieldview', {
      type: 'geojson',
      data: this.fieldview,
      generateId: true
    });

    this.map.addSource('fieldofview3D', {
      type: 'geojson',
      data: this.fieldofview3D,
      generateId: true
    });

    this.map.addSource('fieldofview3Dcontent', {
      type: 'geojson',
      data: this.fieldofview3Dcontent,
      generateId: true
    });

    this.map.addSource('polygondata', {
      type: 'geojson',
      data: this.polygondata,
      generateId: true
    });

    this.map.addSource('linesdata', {
      type: 'geojson',
      data: this.linesdata,
      generateId: true
    });

    this.map.addLayer({
      id: 'fieldofview3D',
      type: 'fill-extrusion',
      source: 'fieldofview3D',
      paint: {
        'fill-extrusion-color': '#CB1AE2',
        'fill-extrusion-height': ['get', 'base'],
        'fill-extrusion-base': ['get', 'height'],
        'fill-extrusion-opacity': 0.6
      }
    });

    this.map.addLayer({
      id: 'fieldofview3Dcontent',
      type: 'fill-extrusion',
      source: 'fieldofview3Dcontent',
      paint: {
        'fill-extrusion-color': '#CB1AE2',
        'fill-extrusion-height': ['get', 'base'],
        'fill-extrusion-base': ['get', 'height'],
        'fill-extrusion-opacity': 0.05
      }
    });

    this.map.addLayer({
      id: 'polygondata_fill',
      type: 'fill',
      source: 'polygondata',
      paint: {
        'fill-color': '#ffffff',
        'fill-opacity': 0.1
      },
      layout: {
        visibility: 'visible'
      }
    });

    this.map.addLayer({
      id: 'polygondata_outline',
      type: 'line',
      source: 'polygondata',
      layout: {},
      paint: {
        'line-color': '#fff',
        'line-width': 1
      }
    });

    this.map.addLayer({
      id: 'linesdata',
      type: 'line',
      source: 'linesdata',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#000',
        'line-width': 2
      }
    });
  }

  processGeoJSONData() {
    for (let i = 0; i < this.geojsoncontents.length; i++) {
      const content = JSON.parse(this.geojsoncontents[i]);
      for (let o = 0; o < content.features.length; o++) {
        if (content.features[o].geometry.type === "Point") {
          this.pointsdata['features'].push(content.features[o]);
        } else if (content.features[o].geometry.type === "Polygon") {
          this.polygondata['features'].push(content.features[o]);
        } else if (content.features[o].geometry.type === "LineString") {
          this.linesdata['features'].push(content.features[o]);
        }
      }
    }

    this.coordinatesArray.forEach((coordinate) => {
      const latitude = coordinate[0];
      const longitude = coordinate[1];
      const Bearingofcamera = coordinate[4];
      const Atitudeofcamera = coordinate[5];
      const URLofcamera = coordinate[2];
      const f = coordinate[9];
      const fquiv = (coordinate[9] * 35) / coordinate[8];
      const FOV = (2 * Math.atan(fquiv / (2 * f))) * (180 / Math.PI);

      this.newExifcamera['features'].push({
        type: 'Feature',
        geometry: {
          coordinates: [longitude, latitude],
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
        bearing: Bearingofcamera 
      };
      this.imgInfoArray.push(imgInfo);

      // Calculate destination and create points for field of view
      const originalpoint = turf.point([longitude, latitude]);
      const destination = turf.destination(originalpoint, 0.003, Bearingofcamera, {
        units: 'kilometers'
      });

      const cameraPoint = [longitude, latitude];
      const targetPoint = destination.geometry.coordinates;

      const points = {
        type: 'Feature',
        properties: {
          angle: FOV
        },
        geometry: {
          type: 'GeometryCollection',
          geometries: [
            {
              type: 'Point',
              coordinates: cameraPoint
            },
            {
              type: 'Point',
              coordinates: targetPoint
            }
          ]
        }
      };

      const options = {
        draggable: true
      };

      const FOVresult = L.geotagPhoto.camera(points, options).getFieldOfView();

      this.fieldview['features'].push({
        type: 'Feature',
        geometry: {
          coordinates: [
            [
              FOVresult.geometry.geometries[1].coordinates[0],
              cameraPoint[1],
              FOVresult.geometry.geometries[1].coordinates[1]
            ]
          ],
          type: 'LineString'
        }
      });

      // Calculate field of view polygons and add them to fieldofview3D and fieldofview3Dcontent features
      const firstline = turf.lineString([cameraPoint, FOVresult.geometry.geometries[1].coordinates[0]]);
      const secondline = turf.lineString([cameraPoint, FOVresult.geometry.geometries[1].coordinates[1]]);

      const firstlinechunk = turf.lineChunk(firstline, 0.00001, {
        units: 'kilometers'
      });
      const secondlinechunk = turf.lineChunk(secondline, 0.00001, {
        units: 'kilometers'
      });

      for (let i = 0; i < firstlinechunk.features.length; i++) {
        const parralellineforfirst = turf.lineChunk(
          turf.lineString([firstlinechunk.features[i].geometry.coordinates[0], secondlinechunk.features[i].geometry.coordinates[0]]),
          0.00002,
          {
            units: 'kilometers'
          }
        );
        const parralellineforsecond = turf.lineChunk(
          turf.lineString([firstlinechunk.features[i].geometry.coordinates[1], secondlinechunk.features[i].geometry.coordinates[1]]),
          0.00002,
          {
            units: 'kilometers'
          }
        );

        this.fieldofview3D['features'].push({
          type: 'Feature',
          geometry: {
            coordinates: [
              [
                firstlinechunk.features[i].geometry.coordinates[0],
                parralellineforfirst.features[0].geometry.coordinates[1],
                parralellineforsecond.features[0].geometry.coordinates[1],
                firstlinechunk.features[i].geometry.coordinates[1]
              ]
            ],
            type: 'Polygon'
          },
          properties: {
            height: (i + 130) / 130,
            base: (i + 131) / 130
          }
        });

        this.fieldofview3D['features'].push({
          type: 'Feature',
          geometry: {
            coordinates: [
              [
                secondlinechunk.features[i].geometry.coordinates[0],
                parralellineforfirst.features[parralellineforfirst.features.length - 1].geometry.coordinates[0],
                parralellineforsecond.features[parralellineforsecond.features.length - 1].geometry.coordinates[0],
                secondlinechunk.features[i].geometry.coordinates[1]
              ]
            ],
            type: 'Polygon'
          },
          properties: {
            height: (i + 130) / 130,
            base: (i + 131) / 130
          }
        });

        this.fieldofview3D['features'].push({
          type: 'Feature',
          geometry: {
            coordinates: [
              [
                firstlinechunk.features[i].geometry.coordinates[0],
                parralellineforfirst.features[0].geometry.coordinates[1],
                parralellineforsecond.features[0].geometry.coordinates[1],
                firstlinechunk.features[i].geometry.coordinates[1]
              ]
            ],
            type: 'Polygon'
          },
          properties: {
            height: (-i + 370) / 370,
            base: (-i + 370) / 370
          }
        });

        this.fieldofview3D['features'].push({
          type: 'Feature',
          geometry: {
            coordinates: [
              [
                secondlinechunk.features[i].geometry.coordinates[0],
                parralellineforfirst.features[parralellineforfirst.features.length - 1].geometry.coordinates[0],
                parralellineforsecond.features[parralellineforsecond.features.length - 1].geometry.coordinates[0],
                secondlinechunk.features[i].geometry.coordinates[1]
              ]
            ],
            type: 'Polygon'
          },
          properties: {
            height: (-i + 370) / 370,
            base: (-i + 370) / 370
          }
        });

        this.fieldofview3Dcontent['features'].push({
          type: 'Feature',
          geometry: {
            coordinates: [
              [
                firstlinechunk.features[i].geometry.coordinates[0],
                secondlinechunk.features[i].geometry.coordinates[0],
                secondlinechunk.features[i].geometry.coordinates[1],
                firstlinechunk.features[i].geometry.coordinates[1]
              ]
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
        });
      }
    });

    // Other processing and layer adding logic can go here...
    // You can call other methods from here to add layers and handle popups.
    this.addExifCameraLayer();
    this.addFieldViewLayer();
  }

  addExifCameraLayer() {
    const imgInfoArray = this.imgInfoArray;
    const deck = this.deck;

    // Create the exifCameraLayer
    const exifCameraLayer = new deck.IconLayer({
      id: 'exif-camera-layer',
      data: imgInfoArray,
      getIcon: (d) => 'marker',
      getPosition: (d) => d.coordinates,
      getColor: (d) => [203, 24, 226],
      getSize: (d) => 2,
      getAngle: (d) => -d.bearing, // negative of bearing as deck.gl uses counter clockwise rotations.
      iconAtlas: this.assetUrl + '/camera.png',
      iconMapping: {
        marker: {
          x: 0,
          y: 0,
          width: 100,
          height: 167,
          mask: true,
        },
      },
      sizeScale: 8,
      billboard: false,
      pickable: true,
      onHover: this.handleHover,
    });

    const exifCameraDeckOverlay = new this.deck.MapboxOverlay({
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
      
      this.map.addControl(markerLayerdeckOverlay);
      this.map.addControl(exifCameraDeckOverlay);
    }

  addFieldViewLayer() {
    const fieldview = this.fieldview;
    const map = this.map;

    // Create the fieldViewLayer
    const fieldViewLayer = new mapboxgl.Layer({
      id: 'field-view-layer',
      type: 'line',
      source: {
        type: 'geojson',
        data: fieldview,
      },
      paint: {
        'line-color': '#00FF00',
        'line-width': 2,
      },
    });

    this.map.addLayer(fieldViewLayer);
  }

  handleHover(info) {
    const { x, y, object } = info;
    const tooltipElement = document.getElementById('custom-tooltip');
    this.map.getCanvas().style.cursor = 'pointer';
    if (object) {
      const tooltipContent = `
        <img src="/galleries/${object.URL}" alt="Click to view full image">
        <br>
        <b>Altitude:</b> ${object.altitude.toFixed(2)}m
        <br>
        <b>Heading:</b> ${object.bearing.toFixed(2)}°
      `;
      const coordinates = info.coordinate;
      while (Math.abs(info.viewport.longitude - coordinates[0]) > 180) {
        coordinates[0] += info.viewport.longitude > coordinates[0] ? 360 : -360;
      }

      tooltipElement.innerHTML = tooltipContent;
      tooltipElement.style.display = 'block';
      tooltipElement.style.left = x + 'px';
      tooltipElement.style.top = y + 'px';
      tooltipElement.style.zIndex = 999;
    } else {
      this.map.getCanvas().style.cursor = '';
      tooltipElement.style.display = 'none';
    }
  }
}
