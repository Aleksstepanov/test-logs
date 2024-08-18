<template>
  <div class="log-search">
    <q-input :model-value="searchText" label="Search" @update:model-value="onSearch($event)" />
    <q-btn @click="prevMatch" class="q-mr-md q-mt-md" :disabled="!hasMatches">Prev</q-btn>
    <q-btn @click="nextMatch" class="q-mt-md" :disabled="!hasMatches">Next</q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  searchText: {
    type: String,
    default: ''
  },
  matches: {
    type: Array as () => number[],
    default: () => []
  },
  currentMatchIndex: {
    type: Number as () => number | null | undefined,
    default: undefined
  }
})
const emit = defineEmits(['updateSearch', 'updateMatches'])

// computed
const hasMatches = computed(() => props.matches.length > 0)

// methods
const onSearch = (event: string | number | null) => {
  emit('updateSearch', event)
}

const prevMatch = () => {
  if (props.matches.length > 0) {
    const newIndex = props.currentMatchIndex !== undefined && props.currentMatchIndex !== null
      ? (props.currentMatchIndex - 1 + props.matches.length) % props.matches.length
      : props.matches.length - 1
    emit('updateMatches', newIndex)
  }
}

const nextMatch = () => {
  if (props.matches.length > 0) {
    const newIndex = props.currentMatchIndex !== undefined && props.currentMatchIndex !== null
      ? (props.currentMatchIndex + 1) % props.matches.length
      : 0
    emit('updateMatches', newIndex)
  }
}
</script>

<style scoped>
.log-search {
  margin-bottom: 16px;
}
</style>
