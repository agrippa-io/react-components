import React from 'react'

import { ComponentMeta } from '@storybook/react'

import {
  GooglePlacesAutocomplete,
  IGooglePlacesAutocompleteProps,
} from '../GooglePlacesAutocomplete'
import { GooglePlacesAutocompleteArgTypes } from './GooglePlacesAutocomplete.argTypes'
import { MapGoogleConfig } from '../../../../../../config'

export default {
  title: 'Components / molecules / MapGoogle / GooglePlacesAutocomplete',
  component: GooglePlacesAutocomplete,
  argTypes: GooglePlacesAutocompleteArgTypes,
  args: {
    config: {
      apiKey: MapGoogleConfig.apiKey,
    },
  },
} as ComponentMeta<typeof GooglePlacesAutocomplete>

export const AutocompleteAPIOverview = (args: IGooglePlacesAutocompleteProps) => (
  <GooglePlacesAutocomplete {...args} />
)
