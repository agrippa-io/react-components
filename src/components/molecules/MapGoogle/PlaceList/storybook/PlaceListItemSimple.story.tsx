import React from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { PlaceList, IPlaceListProps } from '../PlaceList'
import { PREDICTIONS } from './constants'
import { predictionToPlace } from '../../../../../services'
import { MapGoogleConfig } from '../../../../../../config'

const meta: Meta<typeof PlaceList> = {
  title: 'Components / molecules / MapGoogle / PlaceList / PlaceListSimple',
  component: PlaceList,
  argTypes: {},
  args: {
    apiKey: MapGoogleConfig.apiKey,
  },
}
export default meta

export const PlaceListSimple: StoryObj<typeof PlaceList> = {
  args: {
    places: PREDICTIONS.map((prediction) => predictionToPlace(prediction)),
  },
  render: (args: IPlaceListProps) => <PlaceList {...args} />,
}
