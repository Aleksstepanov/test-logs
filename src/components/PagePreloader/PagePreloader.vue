<template>
  <div class="flex justify-center items-center"
       :style="{
         background: backGroundColor,
         height: '100vh',
         width: '100vw'
       }">
    <q-spinner
      :color="color"
      :size="size"
    />
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'PagePreloader'
})

defineProps({
  backGroundColor: {
    type: String,
    default: '#ffffff'
  },
  color: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: '10rem'
  }
})
</script>
