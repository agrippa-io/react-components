import { Validator } from 'ip-num'

export function validateIPv6CidrRange(value: string) {
  if (!value) {
    return true
  }

  const [isValid, errors] = Validator.isValidIPv6CidrRange(value)

  if (errors.length) {
    return errors.shift()
  }

  return isValid
}
