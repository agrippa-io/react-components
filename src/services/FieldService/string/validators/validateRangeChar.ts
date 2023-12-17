import { meetsMinChar, meetsMaxChar } from '../utils'

export interface IValidateRangeCharProps {
  min?: number
  max: number
  message?: string
}

export function validateRangeChar({ min = 1, max, message }: IValidateRangeCharProps) {
  return (value: any) => {
    if ((meetsMinChar(value, min) && meetsMaxChar(value, max)) || value === '') {
      return true
    }

    return message ?? `Must have between ${min} and ${max} characters`
  }
}
