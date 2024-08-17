<template>
  <component :is="component" :class="classList">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
defineOptions({
  name: 'UiField'
})

// props
const props = defineProps({
  component: {
    type: String,
    default: 'div'
  },
  display: {
    type: String as () => 'flex' | 'block' | 'inline' | 'grid',
    default: 'flex'
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  fullHeight: {
    type: Boolean,
    default: false
  },
  direction: {
    type: String as () => 'row' | 'column',
    default: 'row'
  },
  justify: {
    type: String as () => 'center' | 'start' | 'end' | 'space-between' | 'space-around' | 'space-evenly',
    default: 'center'
  },
  align: {
    type: String as () => 'center' | 'start' | 'end' | 'baseline' | 'stretch',
    default: 'center'
  }
})

// computed
const classList = computed(() => {
  return `${props.display || 'flex'} ${props.fullHeight ? 'full-height' : ''} ${
    props.fullWidth ? 'full-width' : ''
  } flex-${props.direction || 'row'} justify-${props.justify || 'center'} items-${props.align || 'center'}`
})

</script>
