import { isNumber } from '../utils'

export interface IValidateNumberProps {
  message?: string
}

export function validateNumber({
  message = 'Must be an number'
}: IValidateNumberProps) {
  return (value: any) => {
    if (isNumber(value) || value === '') {
      return true
    }

    return message
  }
}
