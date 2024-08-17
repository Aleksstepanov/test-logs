<template>
  <div></div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { emitter } from 'src/plugins'

const $q = useQuasar()

// methods
const showNotify = (options) => {
  $q.notify(options)
}

// life hook
onMounted(() => emitter.on('notify', options => showNotify(options)))
</script>
