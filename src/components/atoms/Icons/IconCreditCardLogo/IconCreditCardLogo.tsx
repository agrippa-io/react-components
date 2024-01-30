import React from 'react'
import { IconCreditCardStyle, IconCreditCardCompany, IconCreditCardStyleMap } from './constants'

export interface IIconCreditCardLogoProps {
  height?: number | string
  width?: number | string
  iconStyle:
    | IconCreditCardStyle
    | 'flat'
    | 'flat-rounded'
    | 'logo'
    | 'logo-border'
    | 'mono'
    | 'mono-outline'
  company:
    | IconCreditCardCompany
    | 'alipay'
    | 'amex'
    | 'american-express'
    | 'code'
    | 'code-front'
    | 'diners'
    | 'diners-club'
    | 'discover'
    | 'elo'
    | 'generic'
    | 'hiper'
    | 'hipercard'
    | 'jcb'
    | 'maestro'
    | 'mastercard'
    | 'mir'
    | 'paypal'
    | 'unionpay'
    | 'visa'
}

export function IconCreditCardLogo({
  height = 45,
  width = 70,
  iconStyle,
  company,
}: IIconCreditCardLogoProps) {
  const Component = IconCreditCardStyleMap[iconStyle][company]
  if (!Component) {
    return null
  }

  return <Component height={height} width={width} />
}
