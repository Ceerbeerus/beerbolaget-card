class BeerbolagetCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      card.header = 'Beerbolaget';
      this.content = document.createElement('div');
      this.content.className = "CardDiv";
      this.content.style.padding = '0 16px 16px';
      card.appendChild(this.content);
      this.appendChild(card);

      const entityId = this.config.entity;
      const state = hass.states[entityId];
      const json = JSON.parse(hass.states[entityId].attributes.beverages);
      const stateStr = state ? state.state : 'unavailable';

      var beerList = document.createElement('ul');
      beerList.className = "beer-list";

      for(var x in json){
        var liElement = document.createElement('li');
        liElement.className = "li-element";
        var divBeer = document.createElement('div');
        divBeer.className = "beer-item";

        // Beer image container
        var divBeerImage = document.createElement('div');
        divBeerImage.className = "beer-image";
        var image = json[x]['image'] === "" ? "https://via.placeholder.com/100x180" : json[x]['image'];
        var imageNode = document.createElement('IMG');
        imageNode.src = image;
        divBeerImage.appendChild(imageNode);

        // Beer info container
        var divBeerInfo = document.createElement('div');
        divBeerInfo.className = "beer-info-container";
        var beerInfo = document.createElement('ul');
        beerInfo.className = "beer-info"
        // Beer info - bewery
        var beerInfoBrewery = document.createElement('li');
        var brewery = document.createTextNode(json[x]['brewery']);
        brewery.className = "brewery";
        beerInfoBrewery.appendChild(brewery);
        // Beer info - name
        var beerInfoName = document.createElement('li');
        var beerName = document.createTextNode(json[x]['name']);
        beerName.className = "beer-name";
        beerInfoName.appendChild(beerName);
        // Collect beer info
        beerInfo.appendChild(beerInfoBrewery);
        beerInfo.appendChild(beerInfoName);
        divBeerInfo.appendChild(beerInfo);

        // Append image and info container to beer container.
        divBeer.appendChild(divBeerImage);
        divBeer.appendChild(divBeerInfo);
        liElement.appendChild(divBeer);
        beerList.appendChild(liElement);
      }

      var style = document.createElement('style');

      style.textContent = `
        .beer-list {
          list-style-type:none;
          padding-left:0px;
        }
        .li-element {
          font-size:17px;
          list-style-position:inside;
          border-bottom: 1px solid black;
          padding-top:35px;
          padding-bottom:35px;
        }
        .beer-info {
          list-style-type:none;
          padding: 0px;
        }
        .beer-info-container {
          overflow: auto;
          padding-left: 20px;
        }
        .beer-item {
          clear: both;
          overflow: auto;
        }
        .beer-image {
          float: left;
        }
         `;

      card.appendChild(style);
      this.content.appendChild(beerList);
    }
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 5;
  }
}

customElements.define('beerbolaget-card', BeerbolagetCard);
