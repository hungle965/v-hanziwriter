# V-HANZIWRITER

## Vue Component for Hanzi Writer

This Vue component provides an integration of the Hanzi Writer library for rendering and animating Chinese characters.

### Installation

npm install v-hanziwriter

### Usage

#### Props

- **showOutline** (boolean): Controls whether the outline is shown or hidden on the first render. Default: `true`.

- **showCharacter** (boolean): Controls whether the character is shown or hidden on the first render. Default: `true`.

- **width** (number): Width of the canvas in pixels. Default: `100`.

- **height** (number): Height of the canvas in pixels. Default: `100`.

- **padding** (number): Padding between the character and the edge of the canvas in pixels. Default: `20`.

- **strokeAnimationSpeed** (number): Speed at which to draw each stroke. Must be greater than 0. Default: `1`.

- **strokeHighlightSpeed** (number): Speed at which to highlight each stroke when giving hints in a quiz. Must be greater than 0. Default: `2`.

- **strokeFadeDuration** (number): Time in milliseconds to transition between showing and hiding strokes when calling writer.show() and writer.hide(). Default: `400`.

- **delayBetweenStrokes** (number): Time in milliseconds between each stroke when animating. Default: `1000`.

- **delayBetweenLoops** (number): Time in milliseconds between each animation loop when looping animations. Default: `2000`.

- **strokeColor** (string): The color to draw each stroke. Default: `'#555'`.

- **radicalColor** (string): The color to draw the radical in the stroke if radical data is present. Radicals will be drawn the same color as other strokes if this is not set.

- **highlightColor** (string): The color to use for highlighting in quizzes. Default: `'#AAF'`.

- **outlineColor** (string): The color of the character outline. Default: `'#DDD'`.

- **drawingColor** (string): The color of the lines drawn by users during quizzing. Default: `'#333'`.

- **drawingWidth** (number): The width of the lines drawn by users during quizzing in pixels. Default: `4`.

- **showHintAfterMisses** (number | false): The number of misses before a stroke highlight hint is given to the user. Set to false to disable. Default: `3`.

- **markStrokeCorrectAfterMisses** (number | false): The number of misses before forcing the stroke to be marked correct. Default: Disabled.

- **quizStartStrokeNum** (number): This can be set to start the quiz at a stroke other than the first stroke. Default: `0`.

- **acceptBackwardsStrokes** (boolean): Allow stroke to be drawn backwards during quizzing. Default: `false`.

- **highlightOnComplete** (boolean): Controls whether a quiz briefly highlights the character when the user finishes drawing the whole character. Default: `true`.

- **highlightCompleteColor** (string): The color to use when highlighting the character on complete in quizzes. If not set, `highlightColor` will be used instead. Only relevant if `highlightOnComplete` is true.

- **backgroundRef** (string): Background Element to use when have background slot

- **renderer** ('svg' | 'canvas'): Set this to 'canvas' to render using a 2D canvas instead of SVG. May have better performance on some devices. Default: `'svg'`.

#### Events

- **initialized**: Emits when the Hanzi Writer instance is initialized. It provides the instance of Hanzi Writer as the second argument.

#### Slots

- **background**: Use this slot for providing a background element.

### Example

```vue
<!-- Basically utilize -->
<template>
  <Writer @initialized="onInitialized" :padding="20" />
</template>

<script setup lang="ts">
import { Writer } from 'v-hanziwriter'

const onInitialized = (writer) => {
  console.log('Hanzi Writer initialized:', writer)
}
</script>
```

```vue
<!-- Custom background -->
<script setup lang="ts">
import { ref } from 'vue'
import { Writer, HanziWriter } from 'v-hanziwriter'

const backgroundRef = ref()

const handleInitialzed = (instance: HanziWriter) => {
  console.log(instance)
}
</script>

<template>
  <div>
    <Writer
      @initialized="handleInitialzed"
      :backgroundRef="backgroundRef"
      :padding="20"
    >
      <template #background>
        <svg
          ref="backgroundRef"
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
        >
          <line x1="0" y1="0" x2="100" y2="100" stroke="#DDD" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#DDD" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#DDD" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#DDD" />
        </svg>
      </template>
    </Writer>
  </div>
</template>
```
