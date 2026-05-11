import React from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { FieldAutocomplete, IFieldAutocompleteProps } from '../FieldAutocomplete'
import { FieldAutocompleteArgTypes } from './FieldAutocomplete.argTypes'
import { options } from './constants'

const meta: Meta<typeof FieldAutocomplete> = {
  title: 'Components / molecules / Field / FieldAutocomplete',
  component: FieldAutocomplete,
  argTypes: FieldAutocompleteArgTypes,
  args: {
    options,
  },
}
export default meta

export const FieldAutocompleteOverview: StoryObj<typeof FieldAutocomplete> = {
  render: (args: IFieldAutocompleteProps) => <FieldAutocomplete {...args} />,
}
