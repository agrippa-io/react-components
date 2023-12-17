import { isInteger } from '../utils'

export interface IValidateIntegerProps {
  message?: string
}

export function validateInteger({ message = 'Must be an integer' }) {
  return (value: any) => {
    if (isInteger(value) || value === '') {
      return true
    }

    return message
  }
}
