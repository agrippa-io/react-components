import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { PlaceList, IPlaceListProps } from '../PlaceList'
import { PlaceListItemDetailed } from '../components/PlaceListItemDetailed'
import { PREDICTIONS } from './constants'
import { MapGoogleConfig } from '../../../../../../config'

import { predictionToPlace } from '../../../../../services'

export default {
  title: 'Components / molecules / MapGoogle / PlaceList / PlaceListItemDetail',
  component: PlaceList,
  argTypes: {},
  args: {
    apiKey: MapGoogleConfig.apiKey,
  },
} as ComponentMeta<typeof PlaceList>

export const PlaceListDetailed = (args: IPlaceListProps) => <PlaceList {...args} />

PlaceListDetailed.args = {
  places: PREDICTIONS.map((prediction) => predictionToPlace(prediction)),
  ListItemComponent: PlaceListItemDetailed,
}
