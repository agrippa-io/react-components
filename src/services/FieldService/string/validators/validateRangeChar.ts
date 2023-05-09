import { minChar, maxChar } from '../utils'
import isEmpty from "lodash";

export interface IValidateRangeCharProps {
  min?: number
  max: number
  message?: string
}

export function validateRangeChar({
  min = 1,
  max,
  message,
}: IValidateRangeCharProps) {
  return (value: any) => {
    if (minChar(value, min) && maxChar(value, max) || value === '') {
      return true
    }

    return message ?? `Must have between ${min} and ${max} characters`
  }
}
