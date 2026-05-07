import React from 'react'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

import { IMapGoogleProps } from '../@types'
import { MapGoogle } from '../MapGoogle'
import { MapGoogleArgTypes } from './MapGoogle.argTypes'
import { MapGoogleConfig } from '../../../../../../config'

const meta: Meta<typeof MapGoogle> = {
  title: 'Components / molecules / MapGoogle / MapGoogle',
  component: MapGoogle,
  argTypes: MapGoogleArgTypes,
  args: {
    config: MapGoogleConfig,
  },
}
export default meta

export const MapGoogleOverview: StoryObj<typeof MapGoogle> = {
  render: (args: IMapGoogleProps) => <MapGoogle {...args} />,
}
