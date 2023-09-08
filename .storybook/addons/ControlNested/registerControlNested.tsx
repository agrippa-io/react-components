import { Addon_TypesEnum } from '@storybook/types'

import { IControlNestedProps } from './@types'

import { controlNestedFactory } from './controlNestedFactory'

export const TITLE_CONTROL_NESTED = 'controlNested'

export function registerControlNested(config: IControlNestedProps) {
  return {
    type: Addon_TypesEnum.TOOL,
    title: TITLE_CONTROL_NESTED,
    render: controlNestedFactory(config)
  }
}
