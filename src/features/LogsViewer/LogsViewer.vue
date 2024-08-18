<template>
  <div class="log-viewer">
    <LogFilter @filter="applyFilter" @reset-filters="resetFilters" />
    <LogSearch :searchText="searchText"
               :matches="searchMatches"
               :currentMatchIndex="currentMatchIndex"
               @updateSearch="updateSearch"
               @updateMatches="updateMatches" />
    <q-virtual-scroll
      :items="filteredLogs"
      item-size="24px"
      class="log-list"
      :virtual-scroll-item-key="itemKey"
    >
      <template v-slot="{ item, index }">
        <div :class="getLogClass(item)" :key="index">
          <span>{{ formatTimestamp(item?.Timestamp) }}</span> -
          <span>{{ item.Level }}</span>:
          <span v-html="highlightText(item.Message, index)"></span>
        </div>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { LogItem } from './types'
import { LogFilter } from './components/LogFilter'
import { LogSearch } from './components/LogSearch'
import dayjs from 'dayjs'
import { SERVER_FORMAT_DATE, CLIENT_FORMAT_DATE } from 'src/const/dayjs'

defineOptions({
  name: 'LogsViewer'
})

const props = defineProps<{
  initialLogs: LogItem[];
  defaultSearchText: string;
}>()

const logs = ref<LogItem[]>(props.initialLogs || [])
const searchText = ref(props.defaultSearchText || '')
const selectedLevel = ref<string | null>(null)
const searchMatches = ref<number[]>([])
const currentMatchIndex = ref<number | null>(null)

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchesLevel = !selectedLevel.value || log.Level === selectedLevel.value
    const matchesSearchText = !searchText.value || (log.Message && log.Message.toLowerCase().includes(searchText.value.toLowerCase()))

    return matchesLevel && matchesSearchText
  })
})

const applyFilter = (level: string) => {
  selectedLevel.value = level
  searchText.value = ''
}

const resetFilters = () => {
  selectedLevel.value = null
  searchText.value = ''
  searchMatches.value = []
  currentMatchIndex.value = null
}

const updateSearch = (text: string) => {
  searchText.value = text
  findMatches()
}

const updateMatches = (index: number | null) => {
  currentMatchIndex.value = index
  scrollToMatch()
}

const findMatches = () => {
  searchMatches.value = []
  currentMatchIndex.value = null

  if (!searchText.value.trim()) {
    return
  }

  filteredLogs.value.forEach((log, index) => {
    const message = log.Message || ''
    const regex = new RegExp(searchText.value, 'gi')
    if (regex.test(message)) {
      searchMatches.value.push(index)
    }
  })

  if (searchMatches.value.length > 0) {
    currentMatchIndex.value = 0
    scrollToMatch()
  }
}

const scrollToMatch = async () => {
  if (currentMatchIndex.value !== null && searchMatches.value.length > 0) {
    const matchIndex = searchMatches.value[currentMatchIndex.value]
    await nextTick()
    const scrollContainer = document.querySelector('.q-virtual-scroll__content') as HTMLElement | null
    const item = document.querySelector(`.log-item:nth-child(${matchIndex + 1})`) as HTMLElement | null
    if (scrollContainer && item) {
      scrollContainer.scrollTop = item.offsetTop - scrollContainer.offsetHeight / 2
    }
  }
}

const getLogClass = (log: LogItem) => {
  return `log-item log-${log.Level?.toLowerCase()}`
}

const highlightText = (text: string, index: number) => {
  if (!searchText.value || !searchMatches.value.includes(index)) return text
  const regex = new RegExp(`(${searchText.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const itemKey = (index: number, log: LogItem) => log.Timestamp || index

const formatTimestamp = (timestamp: string) => {
  return dayjs(timestamp, SERVER_FORMAT_DATE).format(CLIENT_FORMAT_DATE)
}
</script>

<style scoped>
.log-list {
  height: 600px;
  overflow-y: auto;
}
.log-item {
  display: flex;
  flex-direction: row;
  justify-content: start;
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
</style>
