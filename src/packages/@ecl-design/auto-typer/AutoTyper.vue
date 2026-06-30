<template>
  <div class="auto-typer">
        <span class="prefix">
            <slot name="prefix">></slot>
        </span>
    <span class="typed-content">
            <span class="word">{{ displayString }}</span>
            <span class="cursor" aria-hidden="true"></span>
        </span>
  </div>
</template>

<script lang="ts" setup>

import type {Ref} from "vue"
import {computed, onMounted, onUnmounted, ref, watch} from "vue"
import {sleep} from "@/helpers/helpers.ts"

interface Props {
    wordList: string[],
    stop?: boolean, // stops typing after current word has finished typing and untyping.
    letterDelay?: number, // delay between each letter when typed
    untypeLetterDelay?: number, // delay between each letter when untyped
    betweenDelay?: number, // delay before starting to untype the word after finishing typing
    afterUntypeDelay?: number, // delay after word has finished typing before new word starts
    prefixSpace?: number, // pixel gap between the prefix and typed content
    cursorWidth?: number, // pixel width of the cursor
}

const {
    wordList,
    stop = false,
    letterDelay = 90,
    untypeLetterDelay = 40,
    betweenDelay = 500,
    afterUntypeDelay = 150,
    prefixSpace = 5,
    cursorWidth = 2
} = defineProps<Props>()

const emit = defineEmits<{
    (event: 'typeStart'): void
    (event: 'typeEnd'): void
    (event: 'untypeStart'): void
    (event: 'untypeEnd'): void
}>()

const currentWord = computed(() => {
    if (wordList?.length > 0) {
        return wordList[currentWordIndex.value]
    }

    return null
})

const displayString = ref('')
const currentWordIndex = ref(0)

function nextWord() {

    currentWordIndex.value++

    if (currentWordIndex.value >= wordList.length) {
        currentWordIndex.value = 0
    }
}

async function typeWord(wordRef: Ref<string>, wordToType: string) {
    for (const c of wordToType) {
        wordRef.value += c

        await sleep(letterDelay)
    }
}

async function untypeWord(wordRef: Ref<string>, delay: number) {
    while (wordRef.value.length > 0) {
        wordRef.value = wordRef.value.slice(0, -1)

        await sleep(delay)
    }
}

const enableLoop = ref(false)
const loopFinished = ref(false)

async function typeLoop() {

    if (enableLoop.value) {

        loopFinished.value = false

        emit('typeStart')
        await typeWord(displayString, currentWord.value ?? '')
        emit('typeEnd')

        await sleep(betweenDelay)

        emit('untypeStart')
        await untypeWord(displayString, untypeLetterDelay)
        emit('untypeEnd')

        await sleep(afterUntypeDelay)
        nextWord()

        loopFinished.value = true
        typeLoop()
    }
}

onMounted(() => {
    enableLoop.value = true
    typeLoop()
})

onUnmounted(() => {
    enableLoop.value = false
})

watch(() => wordList, () => {
    currentWordIndex.value = 0
})

watch(() => stop, () => {
    if (stop) {
        enableLoop.value = false
        return
    }

    enableLoop.value = true
    typeLoop()
})

</script>

<style lang="scss" scoped>

.auto-typer {
  display: flex;
  gap: v-bind('prefixSpace + "px"');
  align-items: baseline;
}

.typed-content {
  display: inline-flex;
  align-items: baseline;
}

.cursor {
  display: inline-block;
  width: v-bind('cursorWidth + "px"');
  height: 1em;
  margin-left: 1px;
  background: currentColor;
  animation: auto-typer-cursor-blink 1s steps(1, end) infinite;
  transform: translateY(0.1em);
}

@keyframes auto-typer-cursor-blink {
  0%, 49% {
    opacity: 1;
  }

  50%, 100% {
    opacity: 0;
  }
}

</style>
