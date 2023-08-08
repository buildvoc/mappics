class MapControllers {
    constructor(map, parsed3dbuildings, draw, geojsoncontents, coordinatesArray, turf, deck, popup, assetUrl) {
      this.map = map;
      this.parsed3dbuildings = parsed3dbuildings;
      this.draw = draw;
      this.geojsoncontents = geojsoncontents;
      this.coordinatesArray = coordinatesArray;
      this.turf = turf;
      this.deck = deck;
      this.popup = popup;
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
      mapModes.setFog();
      mapModes.addBaseMapLayers();
    }
  
    setup3DBuildings() {
      const mapLayers = new MapLayers(this.map, this.parsed3dbuildings);
      mapLayers.addLayers();
    }
  
    setupMapEditing() {
      const mapHandler = new MapHandler(this.map, this.draw);
    }
  
    setupMapControls() {
      const mapControls = new MapControls(this.map);
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
  
      const geoJSONHandler = new GeoJSONHandler(
          this.map,
          this.geojsoncontents,
          this.coordinatesArray,
          this.turf,
          this.deck,
          this.popup,
          this.assetUrl,
          this.pointsdata,
          this.polygondata,
          this.linesdata
        );
      geoJSONHandler.processGeoJSONData();
  
      const mapImageLayer = new MapImageLayer(this.map, this.assetUrl, this.popup, this.pointsdata);

      $('#loading-map').css('display', 'none');
    }
  }
  
