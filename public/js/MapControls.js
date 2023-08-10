class MapControls {
    constructor(map) {
      this.map = map;
      this.addGeolocateControl();
      this.addNavigationControl();
    }
  
    addGeolocateControl() {
      this.map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }), 'top-right');
    }
  
    addNavigationControl() {
      this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }
  }
  