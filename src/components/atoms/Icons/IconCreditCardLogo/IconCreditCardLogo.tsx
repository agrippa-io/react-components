import { IconCreditCardStyle, IconCreditCardCompany, IconCreditCardStyleMap } from './constants'

export interface IconCreditCardLogoProps {
  height?: number | string
  width?: number | string
  iconStyle: IconCreditCardStyle
  company: IconCreditCardCompany
}

export function IconCreditCardLogo({
  height = 45,
  width = 70,
  iconStyle,
  company,
}: IconCreditCardLogoProps) {
  const Component = IconCreditCardStyleMap[iconStyle][company]
  if (!Component) {
    return null
  }

  return <Component height={height} width={width} />
}
