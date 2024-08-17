<template>
  <q-page class="row items-center justify-evenly">
    <p>Test</p>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { WampService } from 'src/services/WAMP/WampService'

defineOptions({
  name: 'PageHome'
})

const wampService = new WampService('ws://test.enter-systems.ru/')
// wampService.connect()
// wampService.login('enter', 'A505a')

onMounted(async () => {
  try {
    await wampService.connect()
    const authResult = await wampService.login('enter', 'A505a')
    console.log('Logged in:', authResult)
  } catch (error) {
    console.log(error)
  }
})
</script>
