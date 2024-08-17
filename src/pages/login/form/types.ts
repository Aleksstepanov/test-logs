export type ValidatorFunction = (value: any) => { $invalid: boolean; $message?: string }

export interface ValidationRule {
  validator: ValidatorFunction
  message: string
}

export interface ValidationRules {
  [field: string]: {
    [ruleName: string]: ValidationRule
  }
}
// Определяем типы для пропсов хука
// export type ValidationRules = Record<string, Record<string, { validator: ValidatorFunction; message: string }>>

export interface UseFormParams {
  fields: Record<string, any>
  rules: ValidationRules
  data?: Record<string, any>
  composeFormData?: (fields: Record<string, any>) => Record<string, any>
  beforeValidate?: () => Promise<boolean> | boolean
  populate?: (data: Record<string, any>) => void
}

export interface ValidationErrors {
  [key: string]: {
    invalid: boolean
    message: string | null
  }
}
