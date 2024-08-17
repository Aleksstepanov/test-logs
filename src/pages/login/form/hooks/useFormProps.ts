export function useFormProps () {
  return {
    data: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    submitting: {
      type: Boolean,
      default: false
    }
  }
}
