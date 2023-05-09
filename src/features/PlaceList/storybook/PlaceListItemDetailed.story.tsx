import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { PlaceList } from '../PlaceList.component'
import { PlaceListItemDetailed } from '../components/PlaceListItemDetailed'
import { PREDICTIONS } from './constants'

import { predictionToPlace } from '../../../services'

export default {
  title: 'travel-react / Components / molecules / PlaceList',
  component: PlaceList,
  argTypes: {},
} as ComponentMeta<typeof PlaceList>;

// @ts-ignore
export const PlaceListDetailed = (args) => <PlaceList {...args} />;

PlaceListDetailed.args = {
  places: PREDICTIONS.map((prediction) => predictionToPlace(prediction)),
  ListItemComponent: PlaceListItemDetailed
}
