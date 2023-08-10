class MapMetadataLayerHandler {
    constructor(map, assetUrl, popup, pointsdata) {
      this.map = map;
      this.assetUrl = assetUrl;
      this.popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth: '500px'
      });;
      this.pointsdata = pointsdata;
  
      this.initialize();
    }

    initialize() {
      this.loadImage();
    }
  
    loadImage() {
      this.map.loadImage(this.assetUrl + 'triangle.png', (error, image) => {
        if (error) throw error;
        this.map.addImage('triangle-icon', image, {
          'sdf': true
        });

        this.addLayer();
        this.setupEventHandlers();
      });
    }
  
    addLayer() {
      this.map.addSource('this.pointsdata', {
        'type': 'geojson',
        'data': {
          type: 'FeatureCollection',
          features: []
        },
        'generateId': true
      });
  
      this.map.addLayer({
        'id': 'this.pointsdata',
        'source': 'this.pointsdata',
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
    }
  
    setupEventHandlers() {
      let triangleCallback1 = (e) => {
        this.map.getCanvas().style.cursor = 'pointer';
        const coordinates = e.features[0].geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
  
        let whattoshow = ``;
  
        const propertieskeys = Object.keys(e.features[0].properties);
        for (let i = 0; i < propertieskeys.length; i++) {
          if (e.features[0].properties[propertieskeys[i]].includes('http')) {
            whattoshow += `<b>${propertieskeys[i].toUpperCase()}:</b> <a href="${e.features[0].properties[propertieskeys[i]]}" target="_blank">Click to see link</a><br>`;
          } else {
            whattoshow += `<b>${propertieskeys[i].toUpperCase()}:</b> ${e.features[0].properties[propertieskeys[i]]}<br>`;
          }
        }
  
        this.popup.setLngLat(coordinates).setHTML(whattoshow).addTo(this.map);
      };
  
      let triangleCallback2 = () => {
        this.map.getCanvas().style.cursor = '';
        this.popup.remove();
      };
  
      this.map.on('mouseenter', 'this.pointsdata', triangleCallback1);
      this.map.on('mouseleave', 'this.pointsdata', triangleCallback2);
      this.map.on('touchend', 'this.pointsdata', triangleCallback2);
  
      this.map.on('click', 'this.pointsdata', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
  
        let whattoshow = `<div style="background-color: #8b8282; color:white; padding-left: 5px; margin-bottom: 5px; display: flex;flex-direction: row;align-items: center;justify-content: space-between"><div>List Entry</div><button style="position:relative; color:white" class="mapboxgl-popup-close-button" type="button" aria-label="Close popup" onClick="popup1.remove();">×</button></div>`;
  
        const propertieskeys = Object.keys(e.features[0].properties);
        for (let i = 0; i < propertieskeys.length; i++) {
          if (e.features[0].properties[propertieskeys[i]].includes('http')) {
            whattoshow += `<b>${propertieskeys[i].toUpperCase()}:</b> <a href="${e.features[0].properties[propertieskeys[i]]}" target="_blank">Click to see link</a><br>`;
          } else {
            whattoshow += `<b>${propertieskeys[i].toUpperCase()}:</b> ${e.features[0].properties[propertieskeys[i]]}<br>`;
          }
        }
  
        this.popup.setLngLat(coordinates).setHTML(whattoshow).addTo(this.map);
      });
    }
  }
