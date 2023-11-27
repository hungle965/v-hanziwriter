<script lang="ts" setup>
import HanziWriter from 'hanzi-writer'
import { nextTick, onMounted, ref, useSlots } from 'vue'

export interface WriterProps {
  /**
   * Controls whether the outline is shown or hidden on the first render.
   * @@default true
   */
  showOutline?: boolean

  /**
   * Controls whether the character is shown or hidden on the first render.
   * @default true
   */
  showCharacter?: boolean

  /**
   * Width of the canvas in pixels.
   * @default 100
   */
  width?: number

  /**
   * Height of the canvas in pixels.
   * @default 100
   */
  height?: number

  /**
   * Padding between the character and the edge of the canvas in pixels.
   * @default 20
   */
  padding?: number

  /**
   * Speed at which to draw each stroke. Must be greater than 0.
   * Increase this number to draw strokes faster, decrease to draw strokes slower.
   * @default 1
   */
  strokeAnimationSpeed?: number

  /**
   * Speed at which to highlight each stroke when giving hints in a quiz. Must be greater than 0.
   * Increase this number to highlight faster, decrease to highlight slower.
   * @default 2
   */
  strokeHighlightSpeed?: number

  /**
   * Time in milliseconds to transition between showing and hiding strokes when calling writer.show() and writer.hide().
   * @default 400
   */
  strokeFadeDuration?: number

  /**
   * Time in milliseconds between each stroke when animating.
   * @default 1000
   */
  delayBetweenStrokes?: number

  /**
   * Time in milliseconds between each animation loop when looping animations.
   * @default 2000
   */
  delayBetweenLoops?: number

  /**
   * The color to draw each stroke.
   * @default '#555'
   */
  strokeColor?: string

  /**
   * The color to draw the radical in the stroke if radical data is present.
   * Radicals will be drawn the same color as other strokes if this is not set.
   */
  radicalColor?: string

  /**
   * The color to use for highlighting in quizzes.
   * @default '#AAF'
   */
  highlightColor?: string

  /**
   * The color of the character outline.
   * @default '#DDD'
   */
  outlineColor?: string

  /**
   * The color of the lines drawn by users during quizzing.
   * @default '#333'
   */
  drawingColor?: string

  /**
   * The width of the lines drawn by users during quizzing in pixels.
   * @default 4
   */
  drawingWidth?: number

  /**
   * The number of misses before a stroke highlight hint is given to the user.
   * Set to false to disable. This can also be set when creating a quiz.
   * @default 3
   */
  showHintAfterMisses?: number | false

  /**
   * The number of misses before forcing the stroke to be marked correct.
   * This can also be set when creating a quiz.
   * @default false
   */
  markStrokeCorrectAfterMisses?: number | false

  /**
   * This can be set to start the quiz at a stroke other than the first stroke.
   * This can also be set when creating a quiz.
   * @default 0
   */
  quizStartStrokeNum?: number

  /**
   * Allow stroke to be drawn backwards during quizzing.
   * This can also be set when creating a quiz.
   * @default false
   */
  acceptBackwardsStrokes?: boolean

  /**
   * Controls whether a quiz briefly highlights the character when the user finishes drawing the whole character.
   * This can also be set when creating a quiz.
   * @default true
   */
  highlightOnComplete?: boolean

  /**
   * The color to use when highlighting the character on complete in quizzes.
   * If not set, `highlightColor` will be used instead.
   * Only relevant if `highlightOnComplete` is true.
   */
  highlightCompleteColor?: string

  /**
   * Background Element to use when have background slot
   */
  backgroundRef?: HTMLElement

  /**
   * Custom function to load character data.
   * See the section on Loading character data for more info on usage.
   */
  // charDataLoader?: () => void

  /**
   * Callback for when character data is loaded successfully.
   * This function is called with the data that was loaded.
   * This can be used to implement a loading spinner.
   */
  onLoadCharDataSuccess?: (data: any) => void

  /**
   * Callback for when character data loading fails.
   * This function is passed whatever the failure reason is from `charDataLoader`.
   */
  onLoadCharDataError?: (error: any) => void

  /**
   * Set this to 'canvas' to render using a 2D canvas instead of SVG.
   * May have better performance on some devices.
   * @default 'svg'
   */
  renderer?: 'svg' | 'canvas'
}

const props: WriterProps = withDefaults(defineProps<WriterProps>(), {
  showOutline: true,
  showCharacter: true,
  width: 100,
  height: 100,
  padding: 20,
  strokeAnimationSpeed: 1,
  strokeHighlightSpeed: 2,
  strokeFadeDuration: 400,
  delayBetweenStrokes: 1000,
  delayBetweenLoops: 2000,
  strokeColor: '#555',
  highlightColor: '#AAF',
  outlineColor: '#DDD',
  drawingColor: '#333',
  drawingWidth: 4,
  showHintAfterMisses: 3,
  markStrokeCorrectAfterMisses: false,
  quizStartStrokeNum: 0,
  acceptBackwardsStrokes: false,
  highlightOnComplete: true,
  // charDataLoader: () => {},
  onLoadCharDataSuccess: (data: any) => {},
  onLoadCharDataError: (error: any) => {},
  renderer: 'svg'
})
const emit = defineEmits<{
  (e: 'initialized', instance: HanziWriter): void
}>()

let writer: HanziWriter | null = null

const hanziElm = ref<HTMLElement>()

onMounted(async () => {
  await nextTick()
  const elm = props.backgroundRef || hanziElm.value
  if (!elm) return
  writer = HanziWriter.create(elm, '英', {
    ...props
  })
  emit('initialized', writer)
})
</script>

<template>
  <div v-if="!$slots.background" ref="hanziElm"></div>
  <slot name="background"></slot>
</template>
