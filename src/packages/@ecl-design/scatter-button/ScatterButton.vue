<template>
    <component :is="componentType" class="scatter-button" @mouseleave="updateTransforms">
        <div class="node-container">
            <div v-for="i in cellCount" :key="i"
                 :style="{transform: transformMap[i - 1]}"
                 class="scatter-node"></div>
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
    distanceUnit?: 'px' | 'rem' | 'em' | 'vw' | 'vh' | 'cm' | 'mm' | 'in' | 'pc' | 'pt' | 'ex' | 'ch' | 'vmin' | 'vmax' | '%',
    scaleMin?: number,
    scaleMax?: number
}>(), {
                               columns: 16,
                               rows: 4,
                               distanceRange: 150,
                               distanceUnit: 'px',
                               scaleMin: 0.1,
                               scaleMax: 0.5
                           })

const cellCount = computed(() => props.columns * props.rows)

const transformMap = ref<string[]>([])

function updateTransforms() {

    transformMap.value = []

    for (let i = 0; i < cellCount.value; i++) {
        transformMap.value.push(`translate(${randomInt(-props.distanceRange, props.distanceRange)}${props.distanceUnit}, ${randomInt(
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
  --scatter-node-spread-color: white;
  --scatter-node-grouped-color: white;
  --scatter-node-spread-opacity: 0.5;
  --scatter-node-grouped-opacity: 1;
  --scatter-button-padding: 0.3rem 1rem;
  --scatter-button-background: transparent;
  --scatter-node-transition-time: 0.4s;
}

.node-container {
    display: grid;
    position: absolute;
    inset: 0;
    grid-template-columns: repeat(v-bind(columnsCSS), 1fr);
    grid-template-rows: repeat(v-bind(rowsCSS), 1fr);
    z-index: -1;
}

.scatter-node {
    background-color: var(--scatter-node-spread-color);
    transition: transform var(--scatter-node-transition-time), background-color var(--scatter-node-transition-time), border-radius calc(var(--scatter-node-transition-time) * 0.75), opacity calc(var(--scatter-node-transition-time) * 0.75);
    pointer-events: none;
    opacity: var(--scatter-node-spread-opacity);
    border-radius: 50%;
}

.scatter-button {
    background-color: var(--scatter-button-background);
    transform: translate(0, 0);
    color: inherit;
    font-size: inherit;
    padding: var(--scatter-button-padding);
    position: relative;
    outline: none;
    border: none;
    cursor: pointer;

    &:hover {
        .hover-animation-item {
            transform: translate(0, 0) scale(1) !important;
            background-color: var(--scatter-node-grouped-color);
            border-radius: 0;
            opacity: var(--scatter-node-grouped-opacity);
        }
    }
}

</style>
