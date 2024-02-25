# Scatter Button

An interactive background made up of scattered points. On hover, the points return to the element to create it's background.

<!-- TOC -->
* [Scatter Button](#scatter-button)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation-)
  * [Getting Started](#getting-started)
    * [Codepen Demo](#codepen-demo)
    * [Slotted Content](#slotted-content)
  * [Available Props](#available-props)
    * [columns](#columns)
    * [rows](#rows)
    * [disableReposition](#disablereposition)
    * [distanceRange](#distancerange)
    * [distanceUnit](#distanceunit)
    * [scaleMin](#scalemin)
    * [scaleMax](#scalemax)
  * [Changing Default Styling](#changing-default-styling)
    * [CSS Variables](#css-variables)
  * [Authors](#authors)
  * [License](#license)
<!-- TOC -->

### Prerequisites

Requires Vue 3

### Installation 

```
npm i @ecl-design/scatter-button
```

## Getting Started

Importing and using the component:

```vue

<script>
  import "@ecl-design/scatter-background/style" //REQUIRED
  import ScatterButton from "@ecl-design/scatter-background"

</script>

<template>
  <scatter-background :columns="10"
                      :rows="3"
                      :distance-range="50"
                      distance-unit="rem">
    <div>
      Slotted Element
    </div>
  </scatter-background>
</template>

<style>

  .scatter-button {
    --scatter-node-grouped-color: red;
    --scatter-node-spread-color: blue;
  }

</style>
```

_Remember to import the component styling as well, the scatter effect will not work otherwise._

### [Codepen Demo](https://codepen.io/eclwebdesign/pen/poGxmrp)

### Slotted Content

The component is intended for use as a wrapper element. Other elements can be slotted into the component as shown above.

## Available Props

### columns
- Type: ```number```
- Default: ```16```
- Description: The number of nodes the button horizontally.

### rows
- Type: ```number```
- Default: ```4```
- Description: The number of nodes the button vertically.

### disableReposition
- Type: ```boolean```
- Default: ```false```
- Description: By default, nodes will reposition themselves every time they scatter, enabling this prop disables that behaviour. Instead, nodes will retain their initial position when scattered.

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
  --scatter-node-spread-color: grey

  //Node color when grouped in button background (hovered)
  --scatter-node-grouped-color: grey

  //Node opacity when spread out
  --scatter-node-spread-opacity: 0.5
  
  //Node opacity when grouped
  --scatter-node-grouped-opacity: 1
  
  //controls the border radius of nodes when spread out, fully round by default
  --scatter-node-border-radius: 100%

  //transition time for transform, color, opacity, and border-radius
  --scatter-node-transition-time: 0.4s
  
  --scatter-button-padding: 0.3rem 1rem
  
  //background of the button when not covered with nodes
  --scatter-button-background: transparent
```

## Authors

This package was created by Elliott Chisholm-Loxley, lead developer at [ECL Web Design](https://eclwebdesign.co.uk)

## License

This project is licensed under the GNU License - see the [LICENSE.md](LICENSE.md) file for details
