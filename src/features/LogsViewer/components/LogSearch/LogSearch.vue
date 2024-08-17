<template>
  <div class="log-search">
    <q-input :model-value="searchText" label="Search" @update:model-value="onSearch($event)" />
    <q-btn @click="prevMatch" :disabled="!hasMatches">Prev</q-btn>
    <q-btn @click="nextMatch" :disabled="!hasMatches">Next</q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed } from 'vue'

defineProps({
  searchText: {
    type: String,
    default: ''
  }
})
const currentMatchIndex = ref<number | null>(null)
const matches = ref<number[]>([])
const emit = defineEmits(['updateSearch', 'updateMatches'])

const onSearch = (event: string | number | null) => {
  emit('updateSearch', event)
  currentMatchIndex.value = null
}

const prevMatch = () => {
  if (matches.value.length > 0) {
    currentMatchIndex.value = (currentMatchIndex.value !== null ? (currentMatchIndex.value - 1 + matches.value.length) % matches.value.length : 0)
    emit('updateMatches', currentMatchIndex.value)
  }
}

const nextMatch = () => {
  if (matches.value.length > 0) {
    currentMatchIndex.value = (currentMatchIndex.value !== null ? (currentMatchIndex.value + 1) % matches.value.length : 0)
    emit('updateMatches', currentMatchIndex.value)
  }
}

const hasMatches = computed(() => matches.value.length > 0)
</script>

<style scoped>
.log-search {
  margin-bottom: 16px;
}
</style>
