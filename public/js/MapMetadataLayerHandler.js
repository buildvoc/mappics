class MapMetadataLayerHandler { 
    constructor(map, assetUrl, pointsdata) {
      this.map = map;
      this.assetUrl = assetUrl;
      this.popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth: '500px'
      });
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
        map.addSource('pointsdata', {
            'type': 'geojson',
            'data': this.pointsdata,
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
        this.map.on('mouseenter', 'pointsdata', triangleCallback1);
    
        let triangleCallback2 = () => {
          this.map.getCanvas().style.cursor = '';
          this.popup.remove();
        };
    
        this.map.on('mouseleave', 'pointsdata', triangleCallback2);
        this.map.on('touchend', 'pointsdata', triangleCallback2);
    
        this.map.on('click', 'pointsdata', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
    
          let whattoshow = `<div style="background-color: #8b8282; color:white; padding-left: 5px; margin-bottom: 5px; display: flex;flex-direction: row;align-items: center;justify-content: space-between"><div>List Entry</div><button style="position:relative; color:white" class="mapboxgl-popup-close-button" type="button" aria-label="Close popup" onClick="closeClickPopup();">×</button></div>`;
    
          const propertieskeys = Object.keys(e.features[0].properties);
          for (let i = 0; i < propertieskeys.length; i++) {
            if (e.features[0].properties[propertieskeys[i]].includes('http')) {
              whattoshow += `<b>${propertieskeys[i].toUpperCase()}:</b> <a href="${e.features[0].properties[propertieskeys[i]]}" target="_blank">Click to see link</a><br>`;
            } else {
              whattoshow += `<b>${propertieskeys[i].toUpperCase()}:</b> ${e.features[0].properties[propertieskeys[i]]}<br>`;
            }
          }
    
          clickPopup.setLngLat(coordinates).setHTML(whattoshow).addTo(this.map);
        });
      });
    }
  }

  // Kept outside class because closeClickPopup functions needs to provided in the onClick callback of the close button added to plain html.
  var clickPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true,
    maxWidth: '500px'
  });
  function closeClickPopup() {
    clickPopup.remove();
  }
