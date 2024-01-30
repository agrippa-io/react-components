import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { FieldAutocomplete, IFieldAutocompleteProps } from '../FieldAutocomplete'
import { FieldAutocompleteArgTypes } from './FieldAutocomplete.argTypes'
import { options } from './constants'

export default {
  title: 'Components / molecules / Field / FieldAutocomplete',
  component: FieldAutocomplete,
  argTypes: FieldAutocompleteArgTypes,
  args: {
    options,
  },
} as ComponentMeta<typeof FieldAutocomplete>

export const FieldAutocompleteOverview = (args: IFieldAutocompleteProps) => (
  <FieldAutocomplete {...args} />
)
