import { Validator } from 'ip-num'

export function validateIPv4Octet(value: string) {
  if (!value) {
    return true
  }

  try {
    const [isValid, errors] = Validator.isValidIPv4Octet(BigInt(value))

    if (errors.length) {
      return errors.shift()
    }

    return isValid
  } catch (err) {
    return 'Value is not a number'
  }
}
