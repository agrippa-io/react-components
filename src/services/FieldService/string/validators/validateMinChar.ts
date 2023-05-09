import { minChar } from '../utils'

export interface IValidateMinCharProps {
  min: number
  message?: string
}

export function validateMinChar({
  min = 1,
  message,
}: IValidateMinCharProps) {
  return (value: any) => {
    if (value === '' || minChar(value, min)) {
      return true
    }

    return message ?? `Must include a minimum of ${min} characters`
  }
}
