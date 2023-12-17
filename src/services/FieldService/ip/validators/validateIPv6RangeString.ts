import { Validator } from 'ip-num'

export function validateIPv6RangeString(value: string) {
  if (!value) {
    return true
  }

  const [isValid, errors] = Validator.isValidIPv6RangeString(value)

  if (errors.length) {
    return errors.shift()
  }

  return isValid
}
