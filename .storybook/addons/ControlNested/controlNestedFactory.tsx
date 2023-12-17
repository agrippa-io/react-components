import { Addon_RenderOptions } from '@storybook/types'
import { IControlNestedProps } from './@types'
import { ControlNestedComponent } from './ControlNestedComponent'

export function controlNestedFactory({ api, argTypes }: IControlNestedProps) {
  return (props: Addon_RenderOptions) => (
    <ControlNestedComponent api={api} argTypes={argTypes} {...props} />
  )
}
