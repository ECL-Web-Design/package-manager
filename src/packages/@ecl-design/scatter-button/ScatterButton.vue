<template>
    <component :is="componentType" class="scatter-button" @mouseleave="updateTransforms">
        <div class="hover-animation-container">
            <div v-for="i in cellCount" :key="i"
                 :style="{transform: transformMap[i - 1]}"
                 class="hover-animation-item"></div>
        </div>
        <slot>Button</slot>
    </component>
</template>

<script lang="ts" setup>

import {computed, ref, useAttrs, watchEffect} from "vue"
import {randomInt, randomRange} from "@/helpers/helpers.js"

const attrs = useAttrs()

//@ts-ignore
const props = withDefaults(defineProps<{
    columns?: number,
    rows?: number,
    distanceRange?: number,
    scaleMin?: number,
    scaleMax?: number
}>(), {
                               columns: 16,
                               rows: 4,
                               distanceRange: 150,
                               scaleMin: 0.1,
                               scaleMax: 0.5
                           })

const cellCount = computed(() => props.columns * props.rows)

const transformMap = ref<string[]>([])

function updateTransforms() {

    transformMap.value = []

    for (let i = 0; i < cellCount.value; i++) {
        transformMap.value.push(`translate(${randomInt(-props.distanceRange, props.distanceRange)}px, ${randomInt(
            -props.distanceRange,
            props.distanceRange
        )}px)
        scale(${randomRange(props.scaleMin, props.scaleMax)})`)
    }
}

watchEffect(updateTransforms)

const componentType = computed(() => {
    if (attrs['to']) {
        return 'router-link'
    }

    if (attrs['href']) {
        return 'a'
    }

    return 'button'
})

const columnsCSS = computed(() => props.columns)
const rowsCSS = computed(() => props.rows)

</script>

<style scoped lang="scss">

.scatter-button {
  --scatter-node-color: rgb(229,23,85);
  --scatter-font-color: white;
  --scatter-padding: 0.3rem 1rem;
  --scatter-font-size: 1.5rem;
  --scatter-button-background: rgb(44, 11, 75);
  --scatter-node-transform-time: 0.4s;
}

.hover-animation-container {
    display: grid;
    position: absolute;
    inset: 0;
    grid-template-columns: repeat(v-bind(columnsCSS), 1fr);
    grid-template-rows: repeat(v-bind(rowsCSS), 1fr);
    z-index: -1;
}

.hover-animation-item {
    background-color: var(--scatter-node-color);
    transition: transform var(--scatter-node-transform-time), border-radius calc(var(--scatter-node-transform-time) * 0.75), opacity calc(var(--scatter-node-transform-time) * 0.75);
    pointer-events: none;
    opacity: 0.5;
    border-radius: 50%;
}

.scatter-button {
    background-color: var(--scatter-button-background);
    transform: translate(0, 0);
    color: var(--scatter-font-color);
    font-size: var(--scatter-font-size);
    padding: var(--scatter-padding);
    position: relative;
    outline: none;
  border: none;
  cursor: pointer;

    &:hover {
        .hover-animation-item {
            transform: translate(0, 0) scale(1) !important;
            border-radius: 0;
            opacity: 1;
        }
    }
}

</style>
