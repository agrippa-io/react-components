import { isExpirationDateCurrent } from '../utils'

export function validateIsExpirationDateCurrent(value: string): boolean | string {
  return isExpirationDateCurrent({ value }) || 'Expired'
}
