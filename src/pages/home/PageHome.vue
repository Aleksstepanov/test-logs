<template>
  <PagePreloader v-if="isLoading" />
  <div v-else class="fullscreen text-center q-pa-md flex flex-center">
    <LogsViewer :initial-logs="logs" default-search-text="" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Logs, LogItem } from './types'
import { WampService } from 'src/services/WAMP/WampService'
import { LogsViewer } from 'src/features/LogsViewer'
import { useAuthStore } from 'src/stores/authStore'
import { PagePreloader } from 'components/PagePreloader'

defineOptions({
  name: 'PageHome'
})

const router = useRouter()
const authStore = useAuthStore()
const wampService = new WampService(process.env.VUE_APP_WAMP || '')

// state
const logs = ref<LogItem[]>([])
const isLoading = ref(false)

// life hooks
onMounted(async () => {
  isLoading.value = true
  try {
    await wampService.connect()
    const { token } = authStore
    if (!token) {
      authStore.clearAuth()
      await router.push({ name: 'page-login' })
    } else {
      try {
        const result = await wampService.loginByToken(token)
        const { Username, Token } = result
        authStore.setToken(Token)
        authStore.setUsername(Username)
      } catch (error) {
        authStore.clearAuth()
        await router.push({ name: 'page-login' })
      }
    }
    await wampService.subscribeToLogs((logData: Logs) => {
      const { Items } = logData
      Items && Items?.length && logs.value.push(...Items)
    })
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})
onUnmounted(() => {
  if (wampService && wampService?.disconnect) {
    wampService.disconnect()
  }
})
</script>
