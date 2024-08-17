import { required } from '@vuelidate/validators'
import { ValidationRules, ValidatorFunction } from './types'
const requiredMsg = 'Это поле обязательно'

export default (): ValidationRules => {
  return {
    login: {
      required: {
        validator: required as unknown as ValidatorFunction,
        message: requiredMsg
      }
    },
    password: {
      required: {
        validator: required as unknown as ValidatorFunction,
        message: requiredMsg
      }
    }
  }
}
