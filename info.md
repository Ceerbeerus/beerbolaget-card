<img src="https://raw.githubusercontent.com/Ceerbeerus/beerbolaget-card/master/example/layout.png" width="300" height="562"/>

# Integration
Install the card in HACS and add the following to your ui-lovelace.yaml
```yaml
- url: /community_plugin/beerbolaget-card/beerbolaget-card.js
  type: js
```

## Releases
Please note that release 0.0.5 of this card requires [`Beerbolaget`](https://github.com/Ceerbeerus/beerbolaget) 0.1.8 to function properly.

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