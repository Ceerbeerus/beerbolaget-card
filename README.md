# Beerbolaget-card


### Required/Options
`api_key` is required to use this card.

|Name                |Default       |Supported options                                 |Description                                                                                                                                                                                                                                                                                                                                    |
| --------------     | ------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`entity`            |`None`        |`String`                                          |Required entity of beerbolaget sensor.
|`rating`            |`False`       |`False | True`                                    |Display ratings from Untappd. This required to also have this option added in the setup of Beerbolaget component.
|`filter_local`      |`False`       |`False | True`                                    |Filter beers not available at the local store. A store must be added as option in the setup of Beerbolaget component.

#### Example
  ```yaml
  view:
    cards:
      -type: custom:beerbolaget-card
       rating: true
       filter_local: true
  ```
