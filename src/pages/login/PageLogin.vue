<template>
  <div class="fullscreen text-white text-center q-pa-md flex flex-center">
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
import { ref } from 'vue'
import { LoginType } from './types'
import { FormLogin } from './form'
import { emitter } from 'src/plugins'
import { WampService } from 'src/services/WAMP/WampService'
import { useRouter } from 'vue-router'
import { setLogin, setPassword } from 'src/services/auth/auth'

defineOptions({
  name: 'PageLogin'
})

const wampService = new WampService('ws://test.enter-systems.ru/')

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
      setLogin(login)
      setPassword(password)
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

</script>
