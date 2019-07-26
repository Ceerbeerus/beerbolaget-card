class BeerbolagetCard extends HTMLElement {
    setConfig(config) {
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }
        this.config = config;
    }

    set hass(hass) {
        if (!this.content) {
            const card = document.createElement('ha-card');
            card.header = 'Beerbolaget';
            this.content = document.createElement('div');
            this.content.className = 'card-div';
            this.content.style.padding = '0 10px 10px';
            card.appendChild(this.content);
            this.appendChild(card);

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
                    list-style-position: inside;
                    padding-bottom: 20px;
                }
                .beer-info {
                    list-style-type: none;
                    padding: 0px;
                }
                .beer-info li {
                    padding: 2px 12px 2px 12px;
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
                    -moz-box-shadow: 8px 0 8px -6px black;
                    -webkit-box-shadow: 8px 0 8px -6px black;
                }
                .beer-image img {
                    display: block;
                    padding: 0px;
                }
                .beer-name {
                    font-weight: bold;
                    font-size: 19px;
                    background-color: #008528;
                }
                .brewery {
                    font-size: 15px;
                    border-bottom: 1px solid gray;
                    margin-top: 5px;
                    margin-bottom: 4px;
                }
                .country, .type, .price, .available, .rating {
                    font-size: 13px;
                }
                .release {
                    margin-top: -15px;
                    margin-bottom: 0px;
                    padding: 0px 0px 15px 8px;
                }
                .category-text{
                    font-weight: bold;
                }

            `;
            card.appendChild(style);
        }

        const entityId = this.config.entity;
        const state = hass.states[entityId];
        if (!state) return;

        const json = JSON.parse(state.attributes.beverages);
        if (!json || !json[1] || this.prev_json == JSON.stringify(json)) return;
        this.prev_json = JSON.stringify(json);

        const show_rating = this.config.rating;
        const filter_local = this.config.filter_local;
        const localStore = state.attributes.local_store;
        const release_date = state.attributes.release_date;

        // Clear card content.
        this.content.innerHTML = "";

        // Release Info
        var releaseInfo = document.createElement('p');
        releaseInfo.className = 'release';
        var release = document.createTextNode('Små partier: ' + release_date);
        releaseInfo.appendChild(release);
        this.content.appendChild(releaseInfo);

        var beerList = document.createElement('ul');
        beerList.className = 'beer-list';

        for (var x in json) {
            if (!filter_local || (filter_local && json[x]['availability_local'])) {
                var liElement = document.createElement('li');
                liElement.className = 'li-element';
                var divBeer = document.createElement('div');
                divBeer.className = 'beer-item';

                // Beer image container
                var divBeerImage = document.createElement('div');
                divBeerImage.className = 'beer-image';
                // Add link to product
                var link = getLink(json[x]['name'], json[x]['id']);
                divBeerImage.appendChild(link);
                var image = json[x]['image'] === '' ? 'https://via.placeholder.com/90x180' : json[x]['image'];
                var imageNode = document.createElement('IMG');
                imageNode.src = image;
                link.appendChild(imageNode);

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

                // Beer Info - Country
                var beerCountry = getBeerCountry(json[x]['country']);

                // Beer Info - Type
                var beerType = getBeerType(json[x]['type']);

                // Beer Info - Price
                var beerPrice = getBeerPrice(json[x]['price']);

                // Collect Beer Info
                beerInfo.appendChild(beerName);
                beerInfo.appendChild(brewery);
                beerInfo.appendChild(beerCountry);
                beerInfo.appendChild(beerType);
                beerInfo.appendChild(beerPrice);

                // Beer Info  - Availability
                if (!filter_local && json[x]['show_availability']) {
                    var beerAvailable = getBeerAvailable(json[x]['availability_local'],
                        localStore);
                    beerInfo.appendChild(beerAvailable);
                }

                // Beer Info - Rating
                if (show_rating && json[x]['untappd_rating']) {
                    var beerRating = getBeerRating(json[x]['untappd_rating']);
                    beerInfo.appendChild(beerRating);
                }

                divBeerInfo.appendChild(beerInfo);

                // Append image and info container to beer container.
                divBeer.appendChild(divBeerImage);
                divBeer.appendChild(divBeerInfo);
                liElement.appendChild(divBeer);
                beerList.appendChild(liElement);
            }
        }
        this.content.appendChild(beerList);


        function getBrewery(brewery) {
            var beerInfoBrewery = document.createElement('li');
            var infoBrewery = document.createTextNode(brewery);
            beerInfoBrewery.className = 'brewery';
            beerInfoBrewery.appendChild(infoBrewery);
            return beerInfoBrewery;
        }

        function getBeerName(brewery, name, detailedName) {
            var beerInfoNameComponent = document.createElement('li');

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
            beerInfoNameComponent.className = 'beer-name';
            beerInfoNameComponent.appendChild(infoName);
            return beerInfoNameComponent;
        }

        function getBeerCountry(country) {
            var beerInfoCountry = document.createElement('li');
            beerInfoCountry.innerHTML = formatText("Land", country);
            beerInfoCountry.className = 'country';
            return beerInfoCountry;
        }

        function getBeerType(type) {
            var beerInfoType = document.createElement('li');
            beerInfoType.innerHTML = formatText("Typ", type);
            beerInfoType.className = 'type';
            return beerInfoType;
        }

        function getBeerPrice(price) {
            var beerInfoPrice = document.createElement('li');
            if (price % 1 != 0) {
                price = price.toFixed(2);
            }
            beerInfoPrice.innerHTML = formatText("Pris", price + ':-');
            beerInfoPrice.className = 'price';
            return beerInfoPrice;
        }

        function getBeerAvailable(available, localStore) {
            var beerInfoAvailable = document.createElement('li');
            var isAvailable = !available ? 'Ej tillgänglig' : 'Tillgänglig';
            beerInfoAvailable.innerHTML = formatText(localStore, isAvailable);
            beerInfoAvailable.className = 'available';
            return beerInfoAvailable;
        }

        function getBeerRating(rating) {
            var beerInfoRating = document.createElement('li');
            beerInfoRating.innerHTML = formatText("Untappd", rating);
            beerInfoRating.className = 'rating';
            return beerInfoRating;
        }

        function formatText(category, text) {
            var formattedText = "<span class='category-text'>" + category + "</span>" + " - " + text;
            return formattedText;
        }

        function getLink(name, id) {
            var link = document.createElement('a');
            link.setAttribute('href', ('https://www.systembolaget.se/dryck/ol/' + formatLink(name, id)));
            link.setAttribute('target', '_blank');
            return link;
        }

        function formatLink(name, id) {
            link = (name + '-' + id).toLowerCase();
            return (link
                     .replace(new RegExp(search, 'å'), 'a')
                     .replace(new RegExp(search, 'ä'), 'a')
                     .replace(new RegExp(search, 'ö'), 'o')
                     .replace(new RegExp(search, 'Ø'), 'o')
                     .replace(new RegExp(search, '&'), '')
                     .replace(new RegExp(search, ' '), '-'));
        }
    }

    getCardSize() {
        return 5;
    }
}
customElements.define('beerbolaget-card', BeerbolagetCard);
