import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { IMapGoogleProps } from '../@types'
import { MapGoogle } from '../MapGoogle'
import { MapGoogleArgTypes } from './MapGoogle.argTypes'
import { MapGoogleConfig } from '../../../../../../config'

export default {
  title: 'Components / molecules / MapGoogle / MapGoogle',
  component: MapGoogle,
  argTypes: MapGoogleArgTypes,
  args: {
    config: MapGoogleConfig,
  },
} as ComponentMeta<typeof MapGoogle>

export const MapGoogleOverview = (args: IMapGoogleProps) => <MapGoogle {...args} />
