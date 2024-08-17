import { unref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { deepClone } from 'src/utils'
import { ValidationErrors, ValidatorFunction, UseFormParams } from '../types'

// Основная функция хука
export function useForm ({
  fields,
  rules,
  data,
  composeFormData,
  beforeValidate,
  populate
}: UseFormParams) {
  // Вычисляем, является ли форма новой
  const isNew = computed(() => {
    return !data || !Object.values(data).some(val => !!val)
  })

  // Вычисляем схему валидации
  const validationSchema = computed(() => {
    const fieldsSchema = Object.entries(rules).reduce((schema, [field, rules]) => {
      schema[field] = Object.entries(rules).reduce((validators, [name, options]) => {
        validators[name] = options.validator
        return validators
      }, {} as Record<string, ValidatorFunction>)
      return schema
    }, {} as Record<string, Record<string, ValidatorFunction>>)
    return { fields: fieldsSchema }
  })

  // Используем Vuelidate для валидации
  const $v = useVuelidate(validationSchema, { fields })

  // Вычисляем ошибки валидации
  const validationErrors = computed<ValidationErrors>(() => {
    const errors: ValidationErrors = Object.keys(rules).reduce((allErrors, fieldName) => {
      const v = unref($v)
      if (!allErrors[fieldName]) allErrors[fieldName] = { invalid: false, message: null }
      if (!v.fields[fieldName].$dirty || v.fields[fieldName].$pending) return allErrors
      Object.entries(rules[fieldName]).forEach(([validatorName, validatorConfig]) => {
        if (
          !allErrors[fieldName].invalid &&
          v.fields[fieldName][validatorName].$invalid
        ) {
          allErrors[fieldName].invalid = true
          allErrors[fieldName].message = validatorConfig.message
        }
      })
      return allErrors
    }, {} as ValidationErrors)
    return errors
  })

  // Функция для заполнения полей формы
  const _populate = (data: Record<string, any>) => {
    Object.keys(fields).forEach(field => {
      const val = data?.[field]
      if (val !== undefined) fields[field] = val
    })
  }

  // Функция для валидации формы
  const _validate = async (): Promise<boolean> => {
    return new Promise(resolve => {
      const v = unref($v)
      v.$reset()
      v.$touch()
      resolve(!v.fields.$error)
    })
  }

  // Функция для подготовки данных формы для отправки
  const emitData = () => {
    const formData = composeFormData ? composeFormData(fields) : deepClone(fields)
    return formData
  }

  // Основная функция для отправки формы
  const _doSubmit = async (): Promise<any> => {
    // Выполняем предварительную валидацию и выходим, если она не прошла
    if (beforeValidate) {
      const next = await beforeValidate()
      if (!next) return
    }

    // Валидируем форму и выходим, если валидация не прошла
    const isValid = await _validate()
    if (!isValid) return

    // Возвращаем данные формы, если валидация прошла успешно
    return emitData()
  }

  // Функция для отправки формы
  const submit = async (): Promise<any> => {
    try {
      return await _doSubmit()
    } catch (e) {
      console.error(e)
    }
  }

  return {
    isNew,
    $v,
    validationErrors,
    submit,
    populate: populate || _populate
  }
}
