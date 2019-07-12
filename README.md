# Beerbolaget-card
A custom card for displaying information provided by [`Beerbolaget`](https://github.com/Ceerbeerus/beerbolaget).

<img src="./example/layout.png" width="300" height="562"/>

A simple tap/click on the picture takes you to the product page of chosen beer.

## Setup
This card is available for integration in two ways, which is described below.

### Local integration
To add this card to your home assistant configuration, download the file (beerbolaget-card.js) and place it under <config_dir>/www/.

Add the following to your ui-lovlace.yaml
```yaml
- url: /local/beerbolaget-card.js
  type: js
```

## Releases
Please note that:

* release 0.0.5 of this card requires [`Beerbolaget`](https://github.com/Ceerbeerus/beerbolaget) 0.1.8 or later to function properly.
* release 0.0.7 of this card requires [`Beerbolaget`](https://github.com/Ceerbeerus/beerbolaget) 0.1.9 or later to function properly.


### Integration through HACS
Install the card in HACS and add the following to your ui-lovelace.yaml
```yaml
- url: /community_plugin/beerbolaget-card/beerbolaget-card.js
  type: js
```

## Required/Options
[`Beerbolaget`](https://github.com/Ceerbeerus/beerbolaget) component is required to use this card.

|Name                |Default       |Supported options                                 |Description                                                                                                                                                                                                                                                                                                                                    |
| --------------     | ------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`entity`            |`None`        |`String`                                          |Required entity of Beerbolaget sensor.
|`rating`            |`false`       |`false \| true`                                   |Display ratings from Untappd. This required to also have this option added in the setup of Beerbolaget component.
|`filter_local`      |`false`       |`false \| true`                                   |Filter to only show beers available at the local store. A store must be added as option in the setup of Beerbolaget component.

## Example
  ```yaml
  view:
    cards:
      -type: custom:beerbolaget-card
       entity: sensor.beerbolaget
       rating: true
       filter_local: true
  ```
