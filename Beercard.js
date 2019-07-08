class BeerCard extends HTMLElement {
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
      const json = JSON.parse(hass.states[entityId].attributes.beer);
      const stateStr = state ? state.state : 'unavailable';

      var beerList = document.createElement('ul');
      beerList.className = "BeerList";

      for(var x in json){
        var liElement = document.createElement('li');
        liElement.className = "LiElement";
        var beerName = json[x]['brewery'] + " - " + json[x]['name'];
        var textNode = document.createTextNode(beerName);
        textNode.className = "InnerText";
        liElement.appendChild(textNode);
        beerList.appendChild(liElement);
      }

      var style = document.createElement('style');

      style.textContent = `
        .BeerList{
          list-style-type:none;
          padding-left:0px;
        }
        .LiElement{
          font-size:17px;
          list-style-position:inside;
          border-bottom: 1px solid black;
          padding-top:35px;
          padding-bottom:35px;
        }
        .InnerText{
          float:left;
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

customElements.define('beer-card', BeerCard);
