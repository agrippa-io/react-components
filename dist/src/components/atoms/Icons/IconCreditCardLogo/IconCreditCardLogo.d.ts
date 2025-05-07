import React from 'react';
import { IconCreditCardStyle, IconCreditCardCompany } from './constants';
export interface IIconCreditCardLogoProps {
    height?: number | string;
    width?: number | string;
    iconStyle: IconCreditCardStyle | 'flat' | 'flat-rounded' | 'logo' | 'logo-border' | 'mono' | 'mono-outline';
    company: IconCreditCardCompany | 'alipay' | 'amex' | 'american-express' | 'code' | 'code-front' | 'diners' | 'diners-club' | 'discover' | 'elo' | 'generic' | 'hiper' | 'hipercard' | 'jcb' | 'maestro' | 'mastercard' | 'mir' | 'paypal' | 'unionpay' | 'visa';
}
export declare function IconCreditCardLogo({ height, width, iconStyle, company, }: IIconCreditCardLogoProps): React.JSX.Element | null;
