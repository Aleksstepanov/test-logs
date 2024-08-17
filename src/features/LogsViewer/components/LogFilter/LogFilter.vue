<template>
  <div class="log-filter">
    <q-btn v-for="level in levels" :key="level" class="q-mr-md" @click="selectLevel(level)">
      {{ level }}
    </q-btn>
    <q-btn
    label="Reset Filters"
    color="warning"
    @click="resetFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

const levels = ['ERROR', 'DEBUG', 'TRACE']
const emit = defineEmits(['filter', 'reset-filters'])

const selectLevel = (level: string) => {
  emit('filter', level)
}
const resetFilters = () => {
  emit('reset-filters')
}
</script>

<style scoped>
.log-filter {
  margin-bottom: 16px;
}
</style>
