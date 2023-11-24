<script setup lang="ts">
import { ref } from 'vue'
import { HanziWriter } from '.'
import Writer from './components/Writer.vue'

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
