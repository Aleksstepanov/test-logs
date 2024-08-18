<template>
  <PagePreloader v-if="isLoading" />
  <div v-else class="fullscreen bg-grey-2 text-center q-pa-md flex flex-center">
    <div class="flex row justify-center q-pl-xl q-pr-xl">
      <FormLogin
        :disabled="isLoading"
        :loading="isLoading"
        @submit-event="onSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { LoginType } from './types'
import { FormLogin } from './form'
import { emitter } from 'src/plugins'
import { WampService } from 'src/services/WAMP/WampService'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { PagePreloader } from 'components/PagePreloader'

defineOptions({
  name: 'PageLogin'
})
const wampService = new WampService(process.env.VUE_APP_WAMP || '')
const authStore = useAuthStore()
const router = useRouter()

// state
const isLoading = ref(false)

// methods
const onSubmit = async (payload: LoginType) => {
  isLoading.value = true
  try {
    const { login, password } = payload
    if (login !== 'enter' || password !== 'A505a') {
      emitter.emit('notify', {
        type: 'negative',
        message: 'Authentication error'
      })
    } else {
      await wampService.connect()
      const authResult = await wampService.login(login, password)
      const { Token, Username } = authResult
      authStore.setToken(Token)
      authStore.setUsername(Username)
      await router.push({ name: 'page-home' })
    }
  } catch (e) {
    console.log('Error: ', e)
    emitter.emit('notify', {
      type: 'negative',
      message: 'Authentication error'
    })
    wampService.disconnect()
  } finally {
    isLoading.value = false
  }
}

// lifehooks
onMounted(async () => {
  isLoading.value = true
  try {
    if (authStore.isAutoLogin) {
      const { token } = authStore
      if (token) {
        await wampService.connect()
        const result = await wampService.loginByToken(token)
        const { Username, Token } = result
        authStore.setToken(Token)
        authStore.setUsername(Username)
        await router.push({ name: 'page-home' })
      }
    }
  } catch (e) {
    console.log('Auto-login error: ', e)
    emitter.emit('notify', {
      type: 'negative',
      message: 'Auto-login error. Please login with password'
    })
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
