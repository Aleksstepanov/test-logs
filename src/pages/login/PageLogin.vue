<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div class="flex row justify-center q-pl-xl q-pr-xl">
      <FormLogin
        @submit-event="onSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LoginType } from './types'
import { FormLogin } from './form'

defineOptions({
  name: 'PageLogin'
})

// methods
const onSubmit = (payload: LoginType) => {
  console.log('payload', payload)
}
</script>
