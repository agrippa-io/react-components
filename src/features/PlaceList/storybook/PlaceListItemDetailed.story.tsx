import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { PlaceList, IPlaceListProps } from '../PlaceList.component'
import { PlaceListItemDetailed } from '../components/PlaceListItemDetailed'
import { PREDICTIONS } from './constants'

import { predictionToPlace } from '../../../services'

export default {
  title: 'travel-react / Components / molecules / PlaceList',
  component: PlaceList,
  argTypes: {},
  args: {
    apiKey: 'AIzaSyAcSRijbcKe4P5jMm1ze6t8S608Tl53K3o',
  },
} as ComponentMeta<typeof PlaceList>

export const PlaceListDetailed = (args: IPlaceListProps) => <PlaceList {...args} />

PlaceListDetailed.args = {
  places: PREDICTIONS.map((prediction) => predictionToPlace(prediction)),
  ListItemComponent: PlaceListItemDetailed,
}
