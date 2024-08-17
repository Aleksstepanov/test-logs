<template>
  <LayoutBroker
    :layouts="layouts"
    :current="$route.meta.layout"
    :pageWrapperClasses="['layout__content']"
  />
</template>

<script setup lang="ts">
import LayoutBroker from 'src/layouts/LayoutBroker.vue'
import layouts from 'src/layouts'
defineOptions({
  name: 'App'
})
</script>
