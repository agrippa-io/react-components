import { Validator } from 'ip-num'

export function validate16BitAsnNumber(value: string) {
  if (!value) {
    return true
  }

  const [isValid, errors] = Validator.isValid16BitAsnNumber(BigInt(value))

  if (errors.length) {
    return errors.shift()
  }

  return isValid
}
