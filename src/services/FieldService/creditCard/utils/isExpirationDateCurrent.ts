import { IsExpirationDateProps } from './types'
import { FORMAT_EXPIRATION_EMPTY, FORMAT_EXPIRATION_PLACEHOLDER } from '../constants'

export function isExpirationDateCurrent({
  value,
  formatPlaceholder = FORMAT_EXPIRATION_PLACEHOLDER,
  formatEmpty = FORMAT_EXPIRATION_EMPTY,
}: IsExpirationDateProps): boolean {
  let isExpirationCurrent = true
  const isPlaceholder = value === formatPlaceholder || value === formatEmpty
  const isFourYearFormat = value?.length === 7
  const isTwoYearFormat = value?.length === 5
  const isValidLength = isTwoYearFormat || isFourYearFormat

  if (!isPlaceholder && isValidLength) {
    const today = new Date()
    const currentYearFull = today.getFullYear().toString()
    const currentYear = isTwoYearFormat ? parseInt(currentYearFull.slice(-2)) : currentYearFull
    const suppliedYear = isTwoYearFormat ? parseInt(value.slice(-2)) : value.slice(-4)
    const isSuppliedYearMatchCurrentYear = suppliedYear == currentYear
    if (isSuppliedYearMatchCurrentYear) {
      const currenMonth = today.getMonth()
      const suppliedMonth = parseInt(value.substring(0, 2)) - 1
      isExpirationCurrent = suppliedMonth > currenMonth
    } else {
      isExpirationCurrent = suppliedYear >= currentYear
    }
  }

  return isExpirationCurrent
}
