import React from 'react'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

import {
  GooglePlacesAutocomplete,
  IGooglePlacesAutocompleteProps,
} from '../GooglePlacesAutocomplete'
import { GooglePlacesAutocompleteArgTypes } from './GooglePlacesAutocomplete.argTypes'
import { MapGoogleConfig } from '../../../../../../config'

const meta: Meta<typeof GooglePlacesAutocomplete> = {
  title: 'Components / molecules / MapGoogle / GooglePlacesAutocomplete',
  component: GooglePlacesAutocomplete,
  argTypes: GooglePlacesAutocompleteArgTypes,
  args: {
    config: {
      apiKey: MapGoogleConfig.apiKey,
    },
  },
}
export default meta

export const AutocompleteAPIOverview: StoryObj<typeof GooglePlacesAutocomplete> = {
  render: (args: IGooglePlacesAutocompleteProps) => <GooglePlacesAutocomplete {...args} />,
}
