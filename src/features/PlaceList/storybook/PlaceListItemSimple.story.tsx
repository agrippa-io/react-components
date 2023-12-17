import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { PlaceList, IPlaceListProps } from '../PlaceList.component'
import { PREDICTIONS } from './constants'
import { predictionToPlace } from '../../../services'

export default {
  title: 'travel-react / Components / molecules / PlaceList',
  component: PlaceList,
  argTypes: {},
} as ComponentMeta<typeof PlaceList>

export const PlaceListSimple = (args: IPlaceListProps) => <PlaceList {...args} />

PlaceListSimple.args = {
  places: PREDICTIONS.map((prediction) => predictionToPlace(prediction)),
}
