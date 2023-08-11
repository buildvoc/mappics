class MapController {
    constructor(map, parsed3dbuildings, geojsoncontents, cameraMetadata, assetUrl) {
      this.map = map;
      this.parsed3dbuildings = parsed3dbuildings;
      this.geojsoncontents = geojsoncontents;
      this.cameraMetadata = cameraMetadata; 
      this.assetUrl = assetUrl;

      this.pointsdata = {
        type: 'FeatureCollection',
        features: []
      };

      this.polygondata = {
        'type': 'FeatureCollection',
        'features': []
      };
  
      this.linesdata = {
        'type': 'FeatureCollection',
        'features': []
      };
    }
  
    initialize() {
      this.setupMapModes();
      this.setup3DBuildings();
      this.setupMapEditing();
      this.setupMapControls();
      this.setupImagesOnMap();
    }
  
    setupMapModes() {
      const mapModes = new MapModes(this.map);
      mapModes.addBaseMapControl();
    }
  
    setup3DBuildings() {
      const mapLayersHandler = new MapLayersHandler(this.map, this.parsed3dbuildings);
      mapLayersHandler.setupBuildingLayers();
    }
  
    setupMapEditing() {
      const mapHandler = new MapEditor(this.map);
    }
  
    setupMapControls() {
      const mapControls = new MapControls(this.map);
    }

    setupMapData(){
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
  
    setupImagesOnMap() {
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
  
      const mapGalleryLayer = new MapGalleryLayer(
          this.map,
          this.cameraMetadata,
          this.assetUrl,
        );
        mapGalleryLayer.processGeoJSONData();

      this.setupMapData();

  
      const mapMetadataLayerHandler = new MapMetadataLayerHandler(this.map, this.assetUrl, this.pointsdata);

      $('#loading-map').css('display', 'none');
    }
  }
  
