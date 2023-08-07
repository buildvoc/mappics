class MapModes {
    constructor(map) {
      this.map = map;
    }
  
    addBaseMapControl() {
      const baseMapControl = `
        <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
          <!-- The rest of your HTML code here -->
        </div>
      `;
  
      $('.mapboxgl-ctrl-top-left').append(baseMapControl);
      // Add click event listeners to the radio buttons to control the layers
      this.addRadioClickListeners();
    }
  
    addRadioClickListeners() {
      // Function to handle the radio button click event and change layer visibility
      const setLayerVisibility = (layerId) => {
        const layers = ['googlehybrid', 'googlesatellite', 'osmstreet'];
        for (const layer of layers) {
          const visibility = layer === layerId ? 'visible' : 'none';
          this.map.setLayoutProperty(layer, 'visibility', visibility);
        }
      };
  
      // Attach event listeners to the radio buttons
      $('input[name="rtoggle"]').on('click', (event) => {
        const layerId = $(event.target).val();
        setLayerVisibility(layerId);
      });
    }
  
    setFog() {
      this.map.setFog({
        'color': 'rgb(255, 255, 255)',
        'high-color': 'rgb(55, 187, 232)',
        'horizon-blend': 0.2
      });
    }
  
    addBaseMapLayers() {
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
  