import { Validator } from 'ip-num'

export function validateIPv6Hexadecatet(value: string) {
  if (!value) {
    return true
  }

  const [isValid, errors] = Validator.isValidIPv6Hexadecatet(BigInt(value))

  if (errors.length) {
    return errors.shift()
  }

  return isValid
}
