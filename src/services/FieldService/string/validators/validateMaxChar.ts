import { maxChar } from '../utils'

export interface IValidateMaxCharProps {
  max: number
  message?: string
}

export function validateMaxChar({
  max,
  message,
}: IValidateMaxCharProps) {
  return (value: any) => {
    if (value === '' || maxChar(value, max)) {
      return true
    }

    return message ?? `Must not exceed ${max} characters`
  }
}
