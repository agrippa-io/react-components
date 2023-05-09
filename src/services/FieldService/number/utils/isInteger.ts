import { ERegexNumber } from '../enums'

export function isInteger(str: string): boolean {
  const result = ERegexNumber.INTEGER.test(str)

  console.log('isInteger - result', result)
  return result
}
