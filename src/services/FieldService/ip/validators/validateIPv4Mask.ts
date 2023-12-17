import { Validator } from 'ip-num'

export function validateIPv4Mask(value: string) {
  if (!value) {
    return true
  }

  const [isValid, errors] = Validator.isValidIPv4Mask(value)

  if (errors.length) {
    return errors.shift()
  }

  return isValid
}
