import { IconCreditCardStyle } from './IconCreditCardStyle'
import { IconCreditCardCompany } from './IconCreditCardCompany'

import { IconCreditCardLogoStyleMapFlat } from './IconStyleMapFlat'
import { IconCreditCardLogoStyleMapFlatRounded } from './IconStyleMapFlatRounded'
import { IconCreditCardLogoStyleMapLogo } from './IconStyleMapLogo'
import { IconCreditCardLogoStyleMapLogoBorder } from './IconStyleMapLogoBorder'
import { IconCreditCardLogoStyleMapMono } from './IconStyleMapMono'
import { IconCreditCardLogoStyleMapMonoOutline } from './IconStyleMapMonoOutline'

export const IconCreditCardStyleMap: Record<
  IconCreditCardStyle,
  Record<IconCreditCardCompany, any>
> = {
  [IconCreditCardStyle.FLAT]: IconCreditCardLogoStyleMapFlat,
  [IconCreditCardStyle.FLAT_ROUNDED]: IconCreditCardLogoStyleMapFlatRounded,
  [IconCreditCardStyle.LOGO]: IconCreditCardLogoStyleMapLogo,
  [IconCreditCardStyle.LOGO_BORDER]: IconCreditCardLogoStyleMapLogoBorder,
  [IconCreditCardStyle.MONO]: IconCreditCardLogoStyleMapMono,
  [IconCreditCardStyle.MONO_OUTLINE]: IconCreditCardLogoStyleMapMonoOutline,
}
