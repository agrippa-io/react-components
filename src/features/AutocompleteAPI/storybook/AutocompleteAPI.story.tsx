import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { AutocompleteAPI } from '../AutocompleteAPI.component'
import { AutocompleteAPIArgTypes } from './AutocompleteAPI.argTypes'
import { options } from './constants'

export default {
  title: 'travel-react / Components / molecules / AutocompleteAPI',
  component: AutocompleteAPI,
  argTypes: AutocompleteAPIArgTypes,
} as ComponentMeta<typeof AutocompleteAPI>;

// @ts-ignore
export const AutocompleteAPIOverview = ({ data, ...args }) => (
  <AutocompleteAPI {...args} options={options} />
)
