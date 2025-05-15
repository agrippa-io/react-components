import { isExpirationDate } from '../utils'

export function validateIsExpirationDate(value: string): boolean | string {
  return isExpirationDate({ value }) || 'Invalid Expiration Date'
}
