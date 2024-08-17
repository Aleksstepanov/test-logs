<template>
  <div class="log-viewer">
    <LogFilter @filter="applyFilter" @reset-filters="resetFilters" />
    <LogSearch :searchText="searchText" @updateSearch="updateSearch" />
    <q-virtual-scroll
      :items="filteredLogs"
      item-size="24px"
      class="log-list"
      :virtual-scroll-item-key="itemKey"
    >
      <template v-slot="{ item, index }">
        <div :class="getLogClass(item)" :key="index">
          <span>{{ item.Timestamp }}</span> -
          <span>{{ item.Level }}</span>:
          <span v-html="highlightText(item.Message)"></span>
        </div>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { LogItem } from './types'
import { LogFilter } from './components/LogFilter'
import { LogSearch } from './components/LogSearch'

const props = defineProps<{
  initialLogs: LogItem[];
  defaultSearchText: string;
}>()

const logs = ref<LogItem[]>(props.initialLogs || [])
const searchText = ref(props.defaultSearchText || '')
const selectedLevel = ref<string | null>(null)

const filteredLogs = computed(() => {
  // Фильтруем логи по уровню и тексту поиска
  return logs.value.filter(log => {
    // Если уровень фильтрации установлен и не совпадает с уровнем лога, пропускаем лог
    const matchesLevel = !selectedLevel.value || log.Level === selectedLevel.value

    // Если текст поиска не пуст и сообщение не содержит текст поиска, пропускаем лог
    const matchesSearchText = !searchText.value || (log.Message && log.Message.toLowerCase().includes(searchText.value.toLowerCase()))

    // Возвращаем true, если лог соответствует обоим условиям
    return matchesLevel && matchesSearchText
  })
})

const applyFilter = (level: string) => {
  selectedLevel.value = level
}

const resetFilters = () => {
  selectedLevel.value = null
}

const updateSearch = (text: string) => {
  searchText.value = text
}

const getLogClass = (log: LogItem) => {
  return `log-item log-${log.Level?.toLowerCase()}`
}

const highlightText = (text: string) => {
  if (!searchText.value) return text
  const regex = new RegExp(`(${searchText.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const itemKey = (index: number, log: LogItem) => log.Timestamp || index
</script>

<style scoped>
.log-list {
  height: 600px;
  overflow-y: auto;
}
.log-item {
  padding: 4px 8px;
  font-family: monospace;
}
.log-error {
  color: red;
}
.log-debug {
  color: green;
}
.log-trace {
  color: blue;
}
/* Добавьте стили для других уровней логов */
</style>
