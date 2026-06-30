# Auto Typer

A component that types out a list of words sequentially with animation.

<!-- TOC -->

* [Auto Typer](#auto-typer)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation-)
    * [Getting Started](#getting-started)
        * [Prefix Slot](#prefix-slot)
    * [Available Props](#available-props)
        * [wordList](#wordlist)
        * [stop](#stop)
        * [letterDelay](#letterdelay)
        * [untypeLetterDelay](#untypeletterdelay)
        * [betweenDelay](#betweendelay)
        * [afterUntypeDelay](#afteruntypedelay)
        * [prefixSpace](#prefixspace)
        * [cursorWidth](#cursorwidth)
    * [Changing Default Styling](#changing-default-styling)
    * [Authors](#authors)
    * [License](#license)

<!-- TOC -->

### Prerequisites

Requires Vue 3

### Installation

```
npm i @ecl-design/auto-typer
```

## Getting Started

Importing and using the component:

```vue

<script>
  import AutoTyper from "@ecl-design/auto-typer"

</script>

<template>
  <auto-typer :word-list="['Websites', 'Apps', 'Design Systems']"
              :prefix-space="6"
              :cursor-width="2"/>
</template>

<style>

  .auto-typer {
    color: red;
  }

</style>
```

### Prefix Slot

The component has a prefix slot that defaults to ```>```.

```vue

<template>
  <auto-typer :word-list="['Websites', 'Apps', 'Design Systems']">
    <template #prefix>
      $
    </template>
  </auto-typer>
</template>
```

## Available Props

### wordList

- Type: ```string[]```
- Default: ```undefined```
- Description: The list of words that will be typed out sequentially.

### stop

- Type: ```boolean```
- Default: ```false```
- Description: Stops typing after the current word has finished typing and untyping, for external control.

### letterDelay

- Type: ```number```
- Default: ```90```
- Description: The delay in milliseconds between each letter being typed.

### untypeLetterDelay

- Type: ```number```
- Default: ```40```
- Description: The delay in milliseconds between each letter being untyped.

### betweenDelay

- Type: ```number```
- Default: ```500```
- Description: The delay in milliseconds before untyping starts after a word has finished typing.

### afterUntypeDelay

- Type: ```number```
- Default: ```150```
- Description: The delay in milliseconds before the next word starts after a word has finished untyping.

### prefixSpace

- Type: ```number```
- Default: ```5```
- Description: The pixel gap between the prefix and typed content.

### cursorWidth

- Type: ```number```
- Default: ```2```
- Description: The pixel width of the cursor.

## Changing Default Styling

Font size and color are inherited by default.

CSS can also be overridden directly with the vue :deep() selector.

## Authors

This package was created by Elliott Chisholm-Loxley, lead developer at [ECL Web Design](https://eclwebdesign.co.uk)

## License

This project is licensed under the GNU License - see the [LICENSE.md](LICENSE.md) file for details
