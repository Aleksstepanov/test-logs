<template>
  <component
    :is="currentLayout"
    :class="layoutClasses"
  >
    <slot name="before-page"></slot>
    <router-view :class="pageWrapperClasses"/>
    <slot name="after-page"></slot>
  </component>
  <ShowNotify />
</template>
<script>
import ShowNotify from 'components/ShowNotify/ShowNotify.vue'

export default {
  name: 'LayoutBroker',
  components: {
    ShowNotify
  },
  props: {
    /**
     * Object with layouts components
     */
    layouts: {
      type: Object,
      default: () => {}
    },

    /**
     * Current layout component name
     */
    current: {
      type: String,
      default: null
    },

    /**
     * Classes binded to layout root component
     */
    layoutClasses: {
      type: [Object, Array],
      default: () => ['layout']
    },

    /**
     * Classes binded to page component
     */
    pageWrapperClasses: {
      type: [Object, Array],
      default: () => ['layout__body']
    }
  },
  computed: {
    /**
     * Return layout component name for current route
     * @return {string}
     */
    currentLayout () {
      return this.layouts[this.current]
    }
  }
}
</script>
