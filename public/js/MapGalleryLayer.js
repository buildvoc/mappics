class MapGalleryLayer {
  constructor(map, cameraMetadata, assetUrl) {
    this.cameraMetadata = cameraMetadata;
    this.map = map;

    this.popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth: '500px'
    });;
    this.assetUrl = assetUrl;

    this.fieldview = {
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

    this.deckGLData = [];

    this.setupExifCameraLayers();
    // this.setupFieldOfViewLayers();
  }

  setupExifCameraLayers() {
    this.cameraMetadata.forEach((coordinate) => {
      const latitude = coordinate[0];
      const longitude = coordinate[1];
      const Bearingofcamera = coordinate[4];
      const Alitudeofcamera = coordinate[5];
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
          URL: URLofcamera,
          AOV: FOV,
          Altitude: Alitudeofcamera,
          'popup_html': coordinate[3]
        }
      });

      const imgInfo = {
        URL: URLofcamera,
        altitude: Alitudeofcamera,
        coordinates: [longitude, latitude, Alitudeofcamera],
        bearing: Bearingofcamera ,
        'popup_html': coordinate[3]
      };
      this.deckGLData.push(imgInfo);

      // Calculate destination and create points for field of view
      // const originalpoint = turf.point([longitude, latitude]);
      // const destination = turf.destination(originalpoint, 0.003, Bearingofcamera, {
      //   units: 'kilometers'
      // });

      // const cameraPoint = [longitude, latitude];
      // const targetPoint = destination.geometry.coordinates;

      // const points = {
      //   type: 'Feature',
      //   properties: {
      //     angle: FOV
      //   },
      //   geometry: {
      //     type: 'GeometryCollection',
      //     geometries: [
      //       {
      //         type: 'Point',
      //         coordinates: cameraPoint
      //       },
      //       {
      //         type: 'Point',
      //         coordinates: targetPoint
      //       }
      //     ]
      //   }
      // };

      // const options = {
      //   draggable: true
      // };

      // const FOVresult = L.geotagPhoto.camera(points, options).getFieldOfView();

      // this.fieldview['features'].push({
      //   type: 'Feature',
      //   geometry: {
      //     coordinates: [
      //       [
      //         FOVresult.geometry.geometries[1].coordinates[0],
      //         cameraPoint[1],
      //         FOVresult.geometry.geometries[1].coordinates[1]
      //       ]
      //     ],
      //     type: 'LineString'
      //   }
      // });

      // Calculate field of view polygons and add them to fieldofview3D and fieldofview3Dcontent features
      // const firstline = turf.lineString([cameraPoint, FOVresult.geometry.geometries[1].coordinates[0]]);
      // const secondline = turf.lineString([cameraPoint, FOVresult.geometry.geometries[1].coordinates[1]]);

      // const firstlinechunk = turf.lineChunk(firstline, 0.00001, {
      //   units: 'kilometers'
      // });
      // const secondlinechunk = turf.lineChunk(secondline, 0.00001, {
      //   units: 'kilometers'
      // });

      // for (let i = 0; i < firstlinechunk.features.length; i++) {
      //   const parralellineforfirst = turf.lineChunk(
      //     turf.lineString([firstlinechunk.features[i].geometry.coordinates[0], secondlinechunk.features[i].geometry.coordinates[0]]),
      //     0.00002,
      //     {
      //       units: 'kilometers'
      //     }
      //   );
      //   const parralellineforsecond = turf.lineChunk(
      //     turf.lineString([firstlinechunk.features[i].geometry.coordinates[1], secondlinechunk.features[i].geometry.coordinates[1]]),
      //     0.00002,
      //     {
      //       units: 'kilometers'
      //     }
      //   );

      //   this.fieldofview3D['features'].push({
      //     type: 'Feature',
      //     geometry: {
      //       coordinates: [
      //         [
      //           firstlinechunk.features[i].geometry.coordinates[0],
      //           parralellineforfirst.features[0].geometry.coordinates[1],
      //           parralellineforsecond.features[0].geometry.coordinates[1],
      //           firstlinechunk.features[i].geometry.coordinates[1]
      //         ]
      //       ],
      //       type: 'Polygon'
      //     },
      //     properties: {
      //       height: (i + 130) / 130,
      //       base: (i + 131) / 130
      //     }
      //   });

      //   this.fieldofview3D['features'].push({
      //     type: 'Feature',
      //     geometry: {
      //       coordinates: [
      //         [
      //           secondlinechunk.features[i].geometry.coordinates[0],
      //           parralellineforfirst.features[parralellineforfirst.features.length - 1].geometry.coordinates[0],
      //           parralellineforsecond.features[parralellineforsecond.features.length - 1].geometry.coordinates[0],
      //           secondlinechunk.features[i].geometry.coordinates[1]
      //         ]
      //       ],
      //       type: 'Polygon'
      //     },
      //     properties: {
      //       height: (i + 130) / 130,
      //       base: (i + 131) / 130
      //     }
      //   });

      //   this.fieldofview3D['features'].push({
      //     type: 'Feature',
      //     geometry: {
      //       coordinates: [
      //         [
      //           firstlinechunk.features[i].geometry.coordinates[0],
      //           parralellineforfirst.features[0].geometry.coordinates[1],
      //           parralellineforsecond.features[0].geometry.coordinates[1],
      //           firstlinechunk.features[i].geometry.coordinates[1]
      //         ]
      //       ],
      //       type: 'Polygon'
      //     },
      //     properties: {
      //       height: (-i + 370) / 370,
      //       base: (-i + 370) / 370
      //     }
      //   });

      //   this.fieldofview3D['features'].push({
      //     type: 'Feature',
      //     geometry: {
      //       coordinates: [
      //         [
      //           secondlinechunk.features[i].geometry.coordinates[0],
      //           parralellineforfirst.features[parralellineforfirst.features.length - 1].geometry.coordinates[0],
      //           parralellineforsecond.features[parralellineforsecond.features.length - 1].geometry.coordinates[0],
      //           secondlinechunk.features[i].geometry.coordinates[1]
      //         ]
      //       ],
      //       type: 'Polygon'
      //     },
      //     properties: {
      //       height: (-i + 370) / 370,
      //       base: (-i + 370) / 370
      //     }
      //   });

      //   this.fieldofview3Dcontent['features'].push({
      //     type: 'Feature',
      //     geometry: {
      //       coordinates: [
      //         [
      //           firstlinechunk.features[i].geometry.coordinates[0],
      //           secondlinechunk.features[i].geometry.coordinates[0],
      //           secondlinechunk.features[i].geometry.coordinates[1],
      //           firstlinechunk.features[i].geometry.coordinates[1]
      //         ]
      //       ],
      //       type: 'Polygon'
      //     },
      //     properties: {
      //       height: (-i + 370) / 370,
      //       base: (i + 130) / 130,
      //       Bearing: Bearingofcamera,
      //       URL: '/galleries/' + URLofcamera,
      //       Altitude: Atitudeofcamera
      //     }
      //   });
      // }
    });

    // Other processing and layer adding logic can go here...
    // You can call other methods from here to add layers and handle popups.
    this.addExifCameraLayers();
  }

  async addExifCameraLayers() {
    var dynamicMarkerData = this.deckGLData;

    await map.once('idle');
    adjustMarkerElevation(dynamicMarkerData, this.map);

    const isMobileDevice = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    const hoverCallback = isMobileDevice ? null : this.onHover.bind(this);

    const url = this.assetUrl + '/cam.gltf';
    const scenegraph = await loaders.parse(loaders.fetchFile(url), loaders.GLTFLoader);
    const exif3dCameraLayer = new deck.ScenegraphLayer({
      id: 'mesh-layer',
      data: dynamicMarkerData,
      scenegraph: scenegraph,
      getPosition: d => d.coordinates,
      getColor: d => [203, 24, 226],
      getOrientation: d => [0, - d.bearing, 90],
      // updateTriggers: {
      //   // This tells deck.gl to recalculate radius when `currentYear` changes
      //   getPosition: [imgInfoArray]
      // },
      sizeScale: 1,
      // _lighting: 'pbr',
      pickable: true,
      onHover: hoverCallback,
      onClick: this.onClick.bind(this),
    });

    const deckglMrkerLayer = new deck.IconLayer({
      id: 'IconLayer',
      data: dynamicMarkerData,
      getIcon: (d) => 'marker',
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: {
          marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
      },
      getPosition: d => d.coordinates,
      getColor: d => [Math.sqrt(d.exits), 140, 0],
      getSize: d => 5,
      // updateTriggers: {
      //   // This tells deck.gl to recalculate radius when `currentYear` changes
      //   getPosition: [imgInfoArray]
      // },
      // getAngle: (d) => - d.bearing, // negative of bearing as deck.gl uses counter clockwise rotations.
      sizeScale: 8,
      billboard: true,
      pickable: true,
      onHover: hoverCallback,
      onClick: this.onClick.bind(this),

      });
  
      const exifCameraDeckOverlay = new deck.MapboxOverlay({
        layers: [exif3dCameraLayer, deckglMrkerLayer],
      });

      this.map.on('move',(event)=>{ 
        if (isMobileDevice ) {
          if (event && event.originalEvent && event.originalEvent.changedTouches && event.originalEvent.changedTouches.length > 0) {
            const touch = event.originalEvent.changedTouches[0];
            const pickInfo = exifCameraDeckOverlay.pickObject({
              x: touch.clientX,
              y: touch.clientY,
              radius: 1
            });
  
            if (pickInfo) {
              this.onHover(pickInfo)
            }
            else {
              this.hideAllTooltips()
            }
          }
        }
        else {
          this.hideAllTooltips();
        }
      })
      
      this.map.addControl(exifCameraDeckOverlay);

      // Define the adjustMarkerElevation function
      function adjustMarkerElevation(data, map) {
        data.forEach((info) => {
            const latitude = info.coordinates[1];
            const longitude = info.coordinates[0];

            const lngLat = {
                lng: longitude,
                lat: latitude
            };
            const elevation = Math.floor(
                map.queryTerrainElevation(lngLat, { exaggerated: false })
            );

            // Update the z-coordinate (altitude) while preserving the original altitude
            info.coordinates[2] = elevation + info.altitude;
        });
      }

      this.map.on('moveend', () => {
        dynamicMarkerData = this.deckGLData; 
        // Call the adjustMarkerElevation function to update the data
        adjustMarkerElevation(dynamicMarkerData, this.map);

        // Update the data of the DeckGL layers with the adjusted imgInfoArray
        exif3dCameraLayer.props.data = dynamicMarkerData;
        deckglMrkerLayer.props.data = dynamicMarkerData;

        // Trigger a redraw of the layers
        exif3dCameraLayer.setChangeFlags({ dataChanged: true });
        deckglMrkerLayer.setChangeFlags({ dataChanged: true });

      });

  
  }

  setupFieldOfViewLayers() {
    this.cameraMetadata.forEach((coordinate) => {
      const latitude = coordinate[0];
      const longitude = coordinate[1];
      const Bearingofcamera = coordinate[4];
      const Atitudeofcamera = coordinate[5];
      const URLofcamera = coordinate[2];
      const f = coordinate[9];
      const fquiv = (coordinate[9] * 35) / coordinate[8];
      const FOV = (2 * Math.atan(fquiv / (2 * f))) * (180 / Math.PI);

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

    this.addFieldOfViewLayers();
  }

  addFieldOfViewLayers() {
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

    const fieldofview3DcontentCallback1 = (e) => {
    this.map.getCanvas().style.cursor = 'pointer';

      const whattoshow = `
        <img src="${e.features[0].properties.URL}" alt="Click to view full image" width="240" height="240"><br>
        <b>Altitude:</b> ${(e.features[0].properties.Altitude).toFixed(2)}m<br>
        <b>Heading:</b> ${(e.features[0].properties.Bearing).toFixed(2)}°<br>
      `;

      this.popup.setLngLat(e.lngLat).setHTML(whattoshow).addTo(this.map);
    };

    // Field of view popup callback when mouse leaves a feature
    const fieldofview3DcontentCallback2 = () => {
      this.map.getCanvas().style.cursor = '';
      this.popup.remove();
    };

    // Add event listeners for mouseenter and mouseleave
    this.map.on('mouseenter', 'fieldofview3Dcontent', fieldofview3DcontentCallback1);
    this.map.on('mouseleave', 'fieldofview3Dcontent', fieldofview3DcontentCallback2);
  }

  onHover(info) {
    const { x, y, object } = info;
    const tooltipElement = document.getElementById('custom-tooltip');
    const cardElement = document.getElementById('custom-card');

    this.map.getCanvas().style.cursor = 'pointer';

     
    const coordinates = info.coordinate;
    if (coordinates) {
      const lngLat = {
        lng: coordinates[0],
        lat: coordinates[1]
      };
      const elevation = Math.floor( 
        // Do not use terrain exaggeration to get actual meter values
        this.map.queryTerrainElevation(lngLat, { exaggerated: false })
      );
    }

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
        cardElement.style.display = 'none'
        tooltipElement.style.display = 'block';
        tooltipElement.style.left = x + 'px';
        tooltipElement.style.top = y + 'px';
        tooltipElement.style.color = 0x000;
        tooltipElement.style.zIndex = 999;
        
    } else {
        this.map.getCanvas().style.cursor = '';
        tooltipElement.style.display = 'none';
    }
  }

  onClick(info) {
    const { x, y, object } = info;
    const mapCanvas = this.map.getCanvas();
    const cardElement = document.getElementById('custom-card');
    const tooltipElement = document.getElementById('custom-tooltip');
  
    mapCanvas.style.cursor = 'pointer';



    const coordinates = info.coordinate;
  
    while (Math.abs(info.viewport.longitude - coordinates[0]) > 180) {
      coordinates[0] += info.viewport.longitude > coordinates[0] ? 360 : -360;
    }
  
    cardElement.innerHTML = object.popup_html;
    cardElement.style.color = '#000';
    cardElement.style.fontSize = '12px';
    cardElement.style.zIndex = 999;
    
    cardElement.style.display = 'block';
    tooltipElement.style.display = 'none'
    cardElement.style.left = x + 'px';
    cardElement.style.top = y + 'px';
  }

  hideAllTooltips() {
    const cardElement = document.getElementById('custom-card');
    const tooltipElement = document.getElementById('custom-tooltip');

    if(cardElement.style.display = 'block')
      cardElement.style.display = 'none';
    
    if(tooltipElement.style.display = 'block')
      tooltipElement.style.display = 'none';
  }

}