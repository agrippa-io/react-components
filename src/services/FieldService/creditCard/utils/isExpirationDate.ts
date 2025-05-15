import {
  FORMAT_EXPIRATION_EMPTY,
  FORMAT_EXPIRATION_PLACEHOLDER,
  REGEX_CREDIT_CARD_EXPIRATION_DATE,
} from '../constants'

export interface IsExpirationDateProps {
  value: string
  formatEmpty?: string
  formatPlaceholder?: string
}
export function isExpirationDate({
  value,
  formatEmpty = FORMAT_EXPIRATION_EMPTY,
  formatPlaceholder = FORMAT_EXPIRATION_PLACEHOLDER,
}: IsExpirationDateProps): boolean {
  return (
    value === formatEmpty ||
    value === formatPlaceholder ||
    REGEX_CREDIT_CARD_EXPIRATION_DATE.test(value)
  )
}
