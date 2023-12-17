import { Validator } from 'ip-num'

export function validateBinaryString(value: string) {
  if (!value) {
    return true
  }

  const [isValid, errors] = Validator.isValidBinaryString(value)

  if (errors.length) {
    return errors.shift()
  }

  return isValid
}
