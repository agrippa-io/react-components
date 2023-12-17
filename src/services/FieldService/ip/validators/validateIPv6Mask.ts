import { Validator } from 'ip-num'

export function validateIPv6Mask(value: string) {
  if (!value) {
    return true
  }

  const [isValid, errors] = Validator.isValidIPv6Mask(value)

  if (errors.length) {
    return errors.shift()
  }

  return isValid
}
