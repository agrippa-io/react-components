import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { MapGoogleSearchField } from '../MapGoogleSearchField.component'
import { MapGoogleSearchFieldArgTypes } from './MapGoogleSearchField.argTypes'

export default {
  title: 'travel-react / Components / molecules / MapGoogleSearchField',
  component: MapGoogleSearchField,
  argTypes: MapGoogleSearchFieldArgTypes,
} as ComponentMeta<typeof MapGoogleSearchField>;

// @ts-ignore
export const MapGoogleOverview = ({ data, ...args }) => (
  <MapGoogleSearchField {...args} />
)
