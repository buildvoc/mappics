class MapHandler {
    constructor(map, draw) {
      this.map = map;
      this.draw = draw;
  
      this.map.addControl(this.draw);
  
      this.map.on('click', 'OS/TopographicArea_2/Building/1_3D', this.handleClick.bind(this));
    }
  
    handleClick(e) {
      this.map.setFilter('OS/TopographicArea_2/Building/1_3D_high', ['in', 'TOID', e.features[0].properties.TOID]);
      this.draw.deleteAll();
      this.map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D', 'visibility', 'none');
      this.map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D_high', 'visibility', 'none');
      this.draw.add(e.features[0]);
  
      $('#insideinfo').css('display', 'block');
  
      $('#discardbutton').click(() => this.handleDiscardButtonClick());
      $('#savebutton').click(async () => await this.handleSaveButtonClick());
      $('#uploadbutton').click(async () => await this.handleUploadButtonClick());
    }
  
    handleDiscardButtonClick() {
      $('#insideinfo').css('display', 'none');
      this.draw.deleteAll();
      this.map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D', 'visibility', 'visible');
      this.map.setFilter('OS/TopographicArea_2/Building/1_3D_high', ['in', 'TOID', '']);
      this.map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D_high', 'visibility', 'visible');
    }
  
    async handleSaveButtonClick() {
      $('#insideinfo').css('display', 'none');
      parsed3dbuildings.features.push(this.draw.getAll().features[0]);
  
      const feature = this.draw.getAll();
      this.map.getSource('new3Dbuildings').setData(parsed3dbuildings);
      filterbuildings.push(['!=', 'TOID', this.draw.getAll().features[0].properties.TOID]);
      this.map.setFilter('OS/TopographicArea_2/Building/1_3D', filterbuildings);
      this.map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D', 'visibility', 'visible');
      this.map.setFilter('OS/TopographicArea_2/Building/1_3D_high', ['in', 'TOID', '']);
      this.map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D_high', 'visibility', 'visible');
      this.draw.deleteAll();
  
      console.log('-------');
      console.log(feature);
      try {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        const raw = JSON.stringify({
          osid: feature.features[0].id,
          toid: feature.features[0].properties.TOID,
          symbol: feature.features[0].properties._symbol,
          height_max: feature.features[0].properties.RelHMax,
          geom: feature.features[0].geometry,
        });
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
        };
        const response = await fetch('https://buildingshistory.co.uk/api/v1/geo', requestOptions);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  
    async handleUploadButtonClick() {
      $('#insideinfo').css('display', 'none');
      parsed3dbuildings.features.push(this.draw.getAll().features[0]);
  
      const feature = this.draw.getAll();
      this.map.getSource('new3Dbuildings').setData(parsed3dbuildings);
      filterbuildings.push(['!=', 'TOID', this.draw.getAll().features[0].properties.TOID]);
      this.map.setFilter('OS/TopographicArea_2/Building/1_3D', filterbuildings);
      this.map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D', 'visibility', 'visible');
      this.map.setFilter('OS/TopographicArea_2/Building/1_3D_high', ['in', 'TOID', '']);
      this.map.setLayoutProperty('OS/TopographicArea_2/Building/1_3D_high', 'visibility', 'visible');
      this.draw.deleteAll();
  
      console.log('-------');
      console.log(feature);
      try {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        const raw = JSON.stringify({
          osid: feature.features[0].id,
          toid: feature.features[0].properties.TOID,
          symbol: feature.features[0].properties._symbol,
          height_max: feature.features[0].properties.RelHMax,
          geom: feature.features[0].geometry,
        });
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
        };
        const response = await fetch('https://buildingshistory.co.uk/api/v1/geo/upload', requestOptions);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  }
  