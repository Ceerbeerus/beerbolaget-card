class BeerbolagetCard extends HTMLElement {
    setConfig(config) {
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }
        this.config = config;
        this.header_background_color = !config.header_background_color ? '#008528' : config.header_background_color;
        this.header_text_color = !config.header_text_color ? '#fcd303' : config.header_text_color;
        this.beer_name_background_color = !config.beer_name_background_color ? '#008528' : config.beer_name_background_color;
        this.beer_name_color = !config.beer_name_color ? '#fcd303' : config.beer_name_color;
        this.release_date_color = !config.release_date_color ? '#fcd303' : config.release_date_color;
        this.available_color = !config.available_color ? '#000000' : config.available_color;
        this.not_available_color = !config.not_available_color ? '#000000' : config.not_available_color;
        this.user_rating_icon_color = !config.user_rating_icon_color ? '#008528' : config.user_rating_icon_color;
        this.user_rating_text_color = !config.user_rating_text_color ? '#ffffff' : config.user_rating_text_color;
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
                .card-header {
                    background-color: ${this.header_background_color};
                    color: ${this.header_text_color};
                    line-height: 50px;
                    padding: 0px 16px 15px;
                    font-weight: 500;
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
                    position: relative;
                    z-index: 1;
                }
                .beer-item {
                    position: relative;
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
                    position: relative;
                    z-index: 2;
                }
                .beer-image img {
                    display: block;
                    padding: 0px;
                }
                .beer-name {
                    font-weight: 500;
                    font-size: 19px;
                    background-color: ${this.beer_name_background_color};
                    color: ${this.beer_name_color};
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
                    margin-top: -25px;
                    margin-bottom: 0px;
                    padding: 0px 0px 15px 8px;
                    font-weight: 500;
                    color: ${this.release_date_color};
                }
                .available {
                    color: ${this.available_color};
                }
                .not_available {
                    color: ${this.not_available_color};
                }
                .rating-container {
                    position: absolute;
                    top: 80px;
                    right: 5px;
                }
                .user-rating {
                    overflow: auto;
                    position: relative;
                }
                .user-rating ha-icon {
                    height: 70px;
                    width: 70px;
                    color: ${this.user_rating_icon_color};
                }
                .user-rating p {
                    color: ${this.user_rating_text_color};
                    position: absolute;
                    top: 2px;
                    left: 18px;
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
        const release_date = state.attributes.release_date;
        if ((json && json[1] && this.prev_json != JSON.stringify(json)) || this.prev_release_date != release_date) {
            // Clear card content.
            this.content.innerHTML = "";
        }
        
        // Release Info
        if (this.prev_release_date == release_date) return;
        this.prev_release_date = release_date;
        
        var releaseInfo = document.createElement('p');
        releaseInfo.className = 'release';
        var release = document.createTextNode('Små partier: ' + release_date);
        releaseInfo.appendChild(release);
        this.content.appendChild(releaseInfo);

        if (!json || !json[1] || this.prev_json == JSON.stringify(json)) return;
        this.prev_json = JSON.stringify(json);

        const show_rating = this.config.rating;
        const filter_local = this.config.filter_local;
        const user_ratings = this.config.user_ratings;
        const localStore = state.attributes.local_store;

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

                // User checkins & rating
                if (user_ratings && json[x]['untappd_checked_in']) {
                    var beerCheckedIn = getUserRating(json[x]['untappd_rating_by_user']);
                    divBeer.appendChild(beerCheckedIn);
                }

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
            var breweryChecks = brewery.toLowerCase().split(' ');
            if (breweryChecks[0] === 'the') {
                breweryChecks.shift();
            }
            if (detailedName && ((name.toLowerCase().includes(breweryChecks[0])) ||
                   (replaceChar(name.toLowerCase()).includes(breweryChecks[0])) ||
                   (breweryChecks.length > 1 &&
                    name.toLowerCase().includes(breweryChecks[1]))) &&
                        (!detailedName.toLowerCase().includes(breweryChecks[0]))) {
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
            var availabilityClass = !available ? 'not_available' : 'available';

            isAvailable = "<span class='" + availabilityClass + "'>" + isAvailable + "</span>";
            beerInfoAvailable.innerHTML = formatText(localStore, isAvailable);
            beerInfoAvailable.className = 'availability';
            return beerInfoAvailable;
        }

        function getBeerRating(rating) {
            var beerInfoRating = document.createElement('li');
            beerInfoRating.innerHTML = formatText("Untappd", rating);
            beerInfoRating.className = 'rating';
            return beerInfoRating;
        }

        function getUserRating(rating_by_user) {
            if (rating_by_user % 1 == 0) {
                rating_by_user = rating_by_user.toFixed(1);
            }
            var ratingContainer = document.createElement('div');
            ratingContainer.className = 'rating-container';
            var ratingByUser = document.createElement('div');
            ratingContainer.appendChild(ratingByUser);
            var icon = document.createElement('ha-icon');
            icon.icon = 'mdi:check-decagram';
            var userRating = document.createElement('p');
            userRating.innerHTML = rating_by_user;
            ratingByUser.appendChild(icon);
            ratingByUser.appendChild(userRating);
            ratingByUser.className = 'user-rating';
            return ratingContainer;
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
            return (replaceChar(link));
        }
        
        function replaceChar(name) {
            return (name
                     .replace(new RegExp('å', 'g'), 'a')
                     .replace(new RegExp('ä', 'g'), 'a')
                     .replace(new RegExp('ê', 'g'), 'e')
                     .replace(new RegExp('ö', 'g'), 'o')
                     .replace(new RegExp('Ø', 'g'), 'o')
                     .replace(new RegExp('& ', 'g'), '')
                     .replace(new RegExp('ü', 'g'), 'u')
                     .replace(new RegExp('/', 'g'), '')
                     .replace(new RegExp("'", 'g'), '')
                     .replace(new RegExp('\\.', 'g'), '')
                     .replace(new RegExp('\\+', 'g'), '')
                     .replace(new RegExp('  ', 'g'), ' ')
                     .replace(new RegExp(' ', 'g'), '-'));
        }
    }

    getCardSize() {
        return 5;
    }
}
customElements.define('beerbolaget-card', BeerbolagetCard);
