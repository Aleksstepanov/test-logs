<template>
  <div class="log-filter">
    <q-btn
      v-for="level in levels"
      :key="level"
      class="q-mr-md"
      :class="{ 'active-filter': selectedLevel === level }"
      @click="selectLevel(level)"
    >
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
import { ref } from 'vue'

const levels = ['ERROR', 'DEBUG', 'TRACE']
const emit = defineEmits(['filter', 'reset-filters'])

const selectedLevel = ref<string | null>(null)

const selectLevel = (level: string) => {
  selectedLevel.value = level
  emit('filter', level)
}
const resetFilters = () => {
  selectedLevel.value = null
  emit('reset-filters')
}
</script>

<style scoped>
.log-filter {
  margin-bottom: 16px;
}
.active-filter {
  background-color: #027be3;
  color: white;
}
</style>
