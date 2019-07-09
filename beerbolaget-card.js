class BeerbolagetCard extends HTMLElement {
    set hass(hass) {
        if (!this.content) {
            const card = document.createElement('ha-card');
            card.header = 'Beerbolaget';
            this.content = document.createElement('div');
            this.content.className = 'card-div';
            this.content.style.padding = '0 10px 10px';
            card.appendChild(this.content);
            this.appendChild(card);

            const entityId = this.config.entity;
            const state = hass.states[entityId];
            const json = JSON.parse(state.attributes.beverages);
            const stateStr = state ? state.state : 'unavailable';

            var beerList = document.createElement('ul');
            beerList.className = 'beer-list';

            for(var x in json){
                var liElement = document.createElement('li');
                liElement.className = 'li-element';
                var divBeer = document.createElement('div');
                divBeer.className = 'beer-item';

                // Beer image container
                var divBeerImage = document.createElement('div');
                divBeerImage.className = 'beer-image';
                var image = json[x]['image'] === '' ? 'https://via.placeholder.com/90x180' : json[x]['image'];
                var imageNode = document.createElement('IMG');
                imageNode.src = image;
                divBeerImage.appendChild(imageNode);

                // Beer info container
                var divBeerInfo = document.createElement('div');
                divBeerInfo.className = 'beer-info-container';
                var beerInfo = document.createElement('ul');
                beerInfo.className = 'beer-info';

                // Beer info - bewery
                var brewery = getBrewery(json[x]['brewery']);

                // Beer info - name
                var beerName = getBeerName(json[x]['brewery'],
                                           json[x]['name'],
                                           json[x]['detailed_name']);

                // Collect beer info
                beerInfo.appendChild(beerName);
                beerInfo.appendChild(brewery);
                divBeerInfo.appendChild(beerInfo);

                // Append image and info container to beer container.
                divBeer.appendChild(divBeerImage);
                divBeer.appendChild(divBeerInfo);
                liElement.appendChild(divBeer);
                beerList.appendChild(liElement);
            }

            var style = document.createElement('style');

            style.textContent = `
                .card-div {
                    margin-top: 0px;
                }
                .beer-list {
                    list-style-type: none;
                    margin: 0px;
                    padding-left: 0px;
                }
                .li-element {
                    font-size: 17px;
                    list-style-position: inside;
                    padding-top: 0px;
                    padding-bottom: 20px;
                }
                .beer-info {
                    list-style-type:none;
                    padding: 0px;
                }
                .beer-info li {
                    padding: 3px 12px 3px 12px;
                }
                .beer-info-container {
                    overflow: auto;
                    padding-left: 0px;
                    padding-top: 10px;
                }
                .beer-item {
                    clear: both;
                    overflow: auto;
                }
                .beer-image {
                    float: left;
                    border-top: 3px solid black;
                    border-right: 3px solid black;
                    border-bottom: 3px solid black;
                    box-shadow: 8px 0 8px -6px black;
                }
                .beer-image img {
                    display: block;
                    padding: 0px;
                }
                .beer-name {
                    font-weight: 800;
                    font-size: 18px;
                    background-color: #008528;
                }
            `;

            card.appendChild(style);
            this.content.appendChild(beerList);
        }

        function getBrewery(brewery) {
            var beerInfoBrewery = document.createElement('li');
            var infoBrewery = document.createTextNode(brewery);
            infoBrewery.className = 'brewery';
            beerInfoBrewery.appendChild(infoBrewery);
            return beerInfoBrewery;
        }

        function getBeerName(brewery, name, detailedName) {
            var beerInfoNameComponent = document.createElement('li');
            beerInfoNameComponent.className = 'beer-name'

            var beerName = name;
            var breweryCheck = brewery.toLowerCase().split(' ')[0];
            if (breweryCheck === 'the') {
                breweryCheck = brewery.toLowerCase().split(' ')[1];
            }
            if (detailedName && name.toLowerCase().includes(breweryCheck) &&
                !detailedName.toLowerCase().includes(breweryCheck)) {
                beerName = detailedName;
            }
            var infoName = document.createTextNode(beerName);
            beerInfoNameComponent.appendChild(infoName);
            return beerInfoNameComponent;
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
