class MapModes {
    constructor(map) {
      this.map = map;
    }
  
    addBaseMapControl() {
      const baseMapControl = `
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
      `;
  
      $('.mapboxgl-ctrl-top-left').append(baseMapControl);

      this.setFog();
      this.addBaseMapLayersHandler();
    }

    setFog() {
      this.map.setFog({
        'color': 'rgb(255, 255, 255)',
        'high-color': 'rgb(55, 187, 232)',
        'horizon-blend': 0.2
      });
    }
  
    addBaseMapLayersHandler() {
      this.map.addLayer({
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
      this.map.addLayer({
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
      this.map.addLayer({
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
    
      // Hide all layers by default
      this.map.setLayoutProperty('googlehybrid', 'visibility', 'none');
      this.map.setLayoutProperty('googlesatellite', 'visibility', 'none');
      this.map.setLayoutProperty('osmstreet', 'visibility', 'none');
    }
  }
  