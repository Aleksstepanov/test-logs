<template>
  <q-form class="flex column justify-center items-center full-width"
          @submit.prevent="onSubmit">

    <div class="flex row justify-center">
      <p class="text-h1">Login</p>
    </div>

    <UiField full-width class="pt-20">
      <q-input
        v-model="fields.login"
        outlined
        class="input"
        label="Имя"
        :is-disabled="disabled"
        :error-message="validationErrors?.login?.message ?? undefined"
        :error="validationErrors.login.invalid"
      />
    </UiField>
    <UiField full-width class="mt-12">
      <q-input
        v-model="fields.password"
        outlined
        class="input"
        label="Пароль"
        type="password"
        :is-disabled="disabled"
        :error-message="validationErrors.password.message ?? undefined"
        :error="validationErrors.password.invalid"
      />
    </UiField>
    <div class=" flex row justify-center full-width mt-28">
      <q-btn class="button button-primary" type="submit" :disable="disabled">
        <p class="text-button-primary q-mb-none">Login</p>
      </q-btn>
    </div>
  </q-form>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { UiField } from 'components/UiField'
import validationRules from './validation-rules'
import { useForm, useFormProps } from './hooks'
import { ValidationRules } from './types'
import { LoginType } from '../types'

defineOptions({
  name: 'FormLogin'
})

// props
defineProps({
  ...useFormProps(),
  disabled: {
    type: Boolean,
    default: false
  }
})

// emits
const $emit = defineEmits<{(event: 'submit-event', formData: LoginType): void;
}>()

// state
const fields = reactive({
  login: null,
  password: null
})

// computed
const rules = validationRules() as ValidationRules
const { submit, validationErrors } = useForm({
  fields,
  rules
})

// methods
const onSubmit = async () => {
  const formData = await submit()
  if (formData) $emit('submit-event', formData)
}
</script>
