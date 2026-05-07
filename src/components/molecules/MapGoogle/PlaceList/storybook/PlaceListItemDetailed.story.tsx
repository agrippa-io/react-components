import React from 'react'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

import { PlaceList, IPlaceListProps } from '../PlaceList'
import { PlaceListItemDetailed } from '../components/PlaceListItemDetailed'
import { PREDICTIONS } from './constants'
import { MapGoogleConfig } from '../../../../../../config'

import { predictionToPlace } from '../../../../../services'

const meta: Meta<typeof PlaceList> = {
  title: 'Components / molecules / MapGoogle / PlaceList / PlaceListItemDetail',
  component: PlaceList,
  argTypes: {},
  args: {
    apiKey: MapGoogleConfig.apiKey,
  },
}
export default meta

export const PlaceListDetailed: StoryObj<typeof PlaceList> = {
  args: {
    places: PREDICTIONS.map((prediction) => predictionToPlace(prediction)),
    ListItemComponent: PlaceListItemDetailed,
  },
  render: (args: IPlaceListProps) => <PlaceList {...args} />,
}
