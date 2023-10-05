<template>
    <component :is="componentType" class="popup-button">
        <span class="text">
            <slot name="text">Button</slot>
        </span>
        <div class="popup">
            <slot name="popup"></slot>
        </div>
    </component>
</template>

<script lang="ts" setup>

import {computed, useAttrs} from "vue"

const attrs = useAttrs()

const componentType = computed(() => {
    if (attrs['href'] && (attrs['href'] as string).startsWith('http')) {
        return 'a'
    }

    if (attrs['to']) {
        return 'router-link'
    }

    return 'button'
})

</script>

<style lang="scss" scoped>

.popup-button {
    color: var(--strong-fg);
    font-size: var(--font-medium);
    padding: 0.8rem 1rem;
    position: relative;
    background-color: transparent;
    overflow: hidden;
    display: inline-block;
    transform: translate(0, 0);

    .popup {
        position: absolute;
        border-top: 5px solid var(--strong-bg);
        inset: 0;
        transition: transform 0.3s, opacity 0.3s;
        transform: translateY(100%) translateY(-4px);
        pointer-events: none;
        z-index: -1;
        opacity: 1;
    }

    &:hover {

        .text {
            transform: scaleY(0.3) translateY(-100%);
            opacity: 0;
        }

        .popup {
            transform: translateY(0);
            opacity: 1;
        }
    }
}

.text {
    display: inline-block;
    transition: transform 0.3s, opacity 0.2s;
    transform-origin: 50% 0;
}

@media screen and (max-width: 600px) {
    .popup {
        border-width: 3px !important;
        font-size: var(--font-small);
    }
}

</style>
