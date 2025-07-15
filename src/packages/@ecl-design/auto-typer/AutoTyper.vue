<template>
    <div class="auto-typer">
        <slot class="prefix" name="prefix">></slot>
        <span class="word">{{ displayString }}</span>
        <span class="cursor">|</span>
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
}

const {
    wordList,
    stop = false,
    letterDelay = 90,
    untypeLetterDelay = 40,
    betweenDelay = 500,
    afterUntypeDelay = 150
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
}

.prefix {
  margin-right: 0.3rem;
}

.cursor {
  font-weight: 400;
}

</style>
