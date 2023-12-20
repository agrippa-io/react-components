import React from 'react'

import { ComponentMeta } from '@storybook/react'

import {
  GooglePlacesAutocomplete,
  IGooglePlacesAutocompleteProps,
} from '../GooglePlacesAutocomplete.component'
import { GooglePlacesAutocompleteArgTypes } from './GooglePlacesAutocomplete.argTypes'

export default {
  title: 'travel-react / Components / molecules / GooglePlacesAutocomplete',
  component: GooglePlacesAutocomplete,
  argTypes: GooglePlacesAutocompleteArgTypes,
  args: {
    apiKey: 'AIzaSyAcSRijbcKe4P5jMm1ze6t8S608Tl53K3o',
  },
} as ComponentMeta<typeof GooglePlacesAutocomplete>

export const AutocompleteAPIOverview = (args: IGooglePlacesAutocompleteProps) => (
  <GooglePlacesAutocomplete {...args} />
)
