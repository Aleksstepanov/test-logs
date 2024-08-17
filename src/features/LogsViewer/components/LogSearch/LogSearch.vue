<template>
  <div class="log-search">
    <q-input v-model="searchText" label="Search" @input="onSearch" />
    <q-btn @click="prevMatch">Prev</q-btn>
    <q-btn @click="nextMatch">Next</q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const searchText = ref('')
const emit = defineEmits(['updateSearch'])

const onSearch = () => {
  emit('updateSearch', searchText.value)
}

const prevMatch = () => {
  // Логика для перехода к предыдущему совпадению
}

const nextMatch = () => {
  // Логика для перехода к следующему совпадению
}
</script>

<style scoped>
.log-search {
  margin-bottom: 16px;
}
</style>
