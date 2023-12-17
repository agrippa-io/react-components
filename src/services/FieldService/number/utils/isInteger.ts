import { ERegexNumber } from '../enums'

export function isInteger(str: string): boolean {
  return ERegexNumber.INTEGER.test(str)
}
