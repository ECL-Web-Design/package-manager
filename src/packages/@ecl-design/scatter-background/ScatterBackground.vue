<template>
    <div class="scatter-background" @mouseleave="onMouseLeave">
        <div class="node-container">
            <template v-for="subMap in transformMap">
                <div v-for="(style, index) in subMap" :key="index"
                     :style="{transform: style.translate, transformOrigin: style.origin}"
                     class="scatter-node"></div>
            </template>
        </div>
        <slot>Content</slot>
    </div>
</template>

<script lang="ts" setup>

import {computed, ref, watchEffect, WatchStopHandle} from "vue"
import {clamp, randomInt, randomRange} from "@/helpers/helpers.js"

//@ts-ignore
const props = withDefaults(defineProps<{
    columns?: number,
    rows?: number,
    disableReposition?: boolean,
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

const transformMap = ref<{ translate: string, origin: string }[][]>([])

function onMouseLeave() {
    if(!props.disableReposition) {
        updateTransforms()
    }
}

function updateTransforms() {

    if(props.rows < 1 || props.columns < 1) {
        console.warn('rows and columns props must be positive numbers above 0')
        return
    }

    transformMap.value = []

    for(let y = 0; y < props.rows; y++) {
        transformMap.value.push([])
        for(let x = 0; x < props.columns; x++) {

            let originX = 50
            let originY = 50

            if(props.columns > 1) {
                if (x === 0) {
                    originX = 0
                } else if (x === props.columns - 1) {
                    originX = 100
                }
            }

            if(props.rows > 1) {
                if (y === 0) {
                    originY = 0
                } else if (y === props.rows - 1) {
                    originY = 100
                }
            }

            transformMap.value[y].push({
                                           translate: `translate(${randomInt(-props.distanceRange, props.distanceRange)}${props.distanceUnit}, ${randomInt(-props.distanceRange, props.distanceRange)}${props.distanceUnit}) scale(${randomRange(props.scaleMin, props.scaleMax)})`,
                                           origin: `${originX}% ${originY}%`
        })
        }
    }
}

let stopReposition : WatchStopHandle | null = watchEffect(updateTransforms)

const columnsCSS = computed(() => props.columns)
const rowsCSS = computed(() => props.rows)

const hoveredScaleX = computed(() => 1 + clamp((props.columns - 1) / 10, 0, 0.8) )
const hoveredScaleY = computed(() => 1 + clamp((props.rows - 1) / 10, 0, 0.8))

</script>

<style scoped lang="scss">

.scatter-background {
  --scatter-node-spread-color: grey;
  --scatter-node-grouped-color: grey;
  --scatter-node-spread-opacity: 0.5;
  --scatter-node-border-radius: 100%;
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
    transition: transform var(--scatter-node-transition-time), background-color var(--scatter-node-transition-time), border-radius calc(var(--scatter-node-transition-time) * 0.75), opacity calc(var(--scatter-node-transition-time) * 0.5);
    pointer-events: none;
    border-radius: var(--scatter-node-border-radius);
    opacity: var(--scatter-node-spread-opacity);
}

.scatter-background {
    background-color: var(--scatter-button-background);
    transform: translate(0, 0);
    color: inherit;
    font-size: inherit;
    padding: var(--scatter-button-padding);
    position: relative;

    &:hover {
        .scatter-node {
            transform: translate(0, 0) scale(v-bind(hoveredScaleX), v-bind(hoveredScaleY)) !important;
            background-color: var(--scatter-node-grouped-color);
            opacity: var(--scatter-node-grouped-opacity);
          border-radius: 0;
        }
    }
}

</style>
