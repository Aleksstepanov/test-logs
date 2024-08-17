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
          <span>{{ dayjs(item?.Timestamp || '', SERVER_FORMAT_DATE).format(CLIENT_FORMAT_DATE) }}</span> -
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
import { dayjs } from 'src/plugins'
import { SERVER_FORMAT_DATE, CLIENT_FORMAT_DATE } from 'src/const/dayjs'
const props = defineProps<{
  initialLogs: LogItem[];
  defaultSearchText: string;
}>()

const logs = ref<LogItem[]>(props.initialLogs || [])
const searchText = ref(props.defaultSearchText || '')
const selectedLevel = ref<string | null>(null)

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchesLevel = !selectedLevel.value || log.Level === selectedLevel.value

    const matchesSearchText = !searchText.value || (log.Message && log.Message.toLowerCase().includes(searchText.value.toLowerCase()))

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
