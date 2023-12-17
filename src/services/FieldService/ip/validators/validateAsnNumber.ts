import { Validator } from 'ip-num'

export function validateAsnNumber(value: string) {
  if (!value) {
    return true
  }

  const [isValid, errors] = Validator.isValidAsnNumber(BigInt(value))

  if (errors.length) {
    return errors.shift()
  }

  return isValid
}
