<template>
  <div class="fullscreen text-center q-pa-md flex flex-center">
    <LogsViewer :initial-logs="logs" default-search-text="" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getLogin, getPassword, setToken, setUsername } from 'src/services/auth/auth'
import { Logs, LogItem } from './types'
import { WampService } from 'src/services/WAMP/WampService'
import { LogsViewer } from 'src/features/LogsViewer'

defineOptions({
  name: 'PageHome'
})

const router = useRouter()
const wampService = new WampService('ws://test.enter-systems.ru/')

// state
const logs = ref<LogItem[]>([])

// life hooks
onMounted(async () => {
  try {
    await wampService.connect()
    const login = getLogin()
    const password = getPassword()
    if (!login || !password) {
      await router.push('/login')
    } else {
      const authResult = await wampService.login(login, password)
      const { Token, Username } = authResult
      setToken(Token)
      setUsername(Username)

      await wampService.subscribeToLogs((logData: Logs) => {
        const { Items } = logData
        Items && Items?.length && logs.value.push(...Items)
      })
    }
  } catch (error) {
    console.log(error)
  }
})
onUnmounted(() => {
  if (wampService && wampService?.disconnect) {
    wampService.disconnect()
  }
})
</script>
