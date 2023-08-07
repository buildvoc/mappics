class MapLayers {
    constructor(map, parsed3dbuildings) {
      this.map = map;
      this.parsed3dbuildings = parsed3dbuildings;
    }
  
    addLayers() {
      this.addLayer1();
      this.addLayer2();
      this.setFilter();
      this.addNew3DBuildings();
    }
  
    addLayer1() {
      this.map.addLayer({
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
    }
  
    addLayer2() {
      this.map.addLayer({
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
    }
  
    setFilter() {
      var filterbuildings = ["all", ["!=", "TOID", "test"]];
      for (var i = 0; i < this.parsed3dbuildings.features.length; i++) {
        filterbuildings.push(["!=", "TOID", this.parsed3dbuildings.features[i].properties.TOID]);
        this.parsed3dbuildings.features[i].properties.RelHMax = parseFloat(this.parsed3dbuildings.features[i].properties.RelHMax);
      }
      this.map.setFilter('OS/TopographicArea_2/Building/1_3D', filterbuildings);
    }
  
    addNew3DBuildings() {
      this.map.addSource('new3Dbuildings', {
        type: 'geojson',
        data: this.parsed3dbuildings
      });
      this.map.addLayer({
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
    }
  }
  