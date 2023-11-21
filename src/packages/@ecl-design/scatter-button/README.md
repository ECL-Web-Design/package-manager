# Scatter Button

An interactive button made up of scattered points. On hover, the points move towards the button to create it's background.

### Prerequisites

Requires Vue

### Installation 

```
npm i @ecl-design/scatter-button
```

## Getting Started

```vue

<script>
  import ScatterButton from "@ecl-design/scatter-button"

</script>

<template>
  <scatter-button :columns="10" :rows="3" :distance-range="50" distance-unit="rem"></scatter-button>
</template>

<style>
  
  .scatter-button {
    --scatter-node-grouped-color: red;
    --scatter-node-spread-color: blue;
  }
  
</style>
```

### Codepen Demo

https://codepen.io/eclwebdesign/pen/oNmqaZo

## Available Props

### columns
- Type: ```number```
- Default: ```16```
- Description: The number of nodes the button horizontally.

### rows
- Type: ```number```
- Default: ```4```
- Description: The number of nodes the button vertically.

### distanceRange
- Type: ```number```
- Default: ```150```
- Description: The maximum distance a node will travel away from the button when scattered, use ```distanceUnit``` to 
specify the css unit. The node will pick a random distance between ```+ distanceRange``` and ```- distanceRange``` for both it's x and y positions.

### distanceUnit
- Type: ```any valid css unit: px, rem, vw, etc.```
- Default: ```px```
- Description: The unit that ```distanceRange``` is measured in.

### scaleMin
- Type: ```number```
- Default: ```0.1```
- Description: The minimum scale that a node will transform to when scattered.

### scaleMax
- Type: ```number```
- Default: ```0.5```
- Description: The maximum scale that a node will transform to when scattered.

## Changing Default Styling

The component comes with a number of css variables that can be overridden to change it's styling.

Font size and color are inherited by default.

CSS can also be overridden directly with the vue :deep() selector.

### CSS Variables

```sass
  //Node color when spread out (not-hovered)
  --scatter-node-spread-color: white;

  //Node color when grouped in button background (hovered)
  --scatter-node-grouped-color: white;

  //Node opacity when spread out
  --scatter-node-spread-opacity: 0.5;
  
  //Node opacity when grouped
  --scatter-node-grouped-opacity: 1;

  //transition time for transform, color, opacity, and border-radius
  --scatter-node-transition-time: 0.4s;
  
  --scatter-button-padding: 0.3rem 1rem;
  
  //background of the button when not covered with nodes
  --scatter-button-background: transparent;
```

## Authors

This package was created by Elliott Chisholm-Loxley, lead developer at [ECL Web Design](https://eclwebdesign.co.uk)

## License

This project is licensed under the GNU License - see the [LICENSE.md](LICENSE.md) file for details
