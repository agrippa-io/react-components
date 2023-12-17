import { Validator } from 'ip-num'

export function validateIPv4RangeString(value: string) {
  if (!value) {
    return true
  }

  const [isValid, errors] = Validator.isValidIPv4RangeString(value)

  if (errors.length) {
    return errors.shift()
  }

  return isValid
}
