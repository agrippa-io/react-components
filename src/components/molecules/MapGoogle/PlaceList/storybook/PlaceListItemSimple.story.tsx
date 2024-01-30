import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { PlaceList, IPlaceListProps } from '../PlaceList'
import { PREDICTIONS } from './constants'
import { predictionToPlace } from '../../../../../services'
import { MapGoogleConfig } from '../../../../../../config'

export default {
  title: 'Components / molecules / MapGoogle / PlaceList / PlaceListSimple',
  component: PlaceList,
  argTypes: {},
  args: {
    apiKey: MapGoogleConfig.apiKey,
  },
} as ComponentMeta<typeof PlaceList>

export const PlaceListSimple = (args: IPlaceListProps) => <PlaceList {...args} />

PlaceListSimple.args = {
  places: PREDICTIONS.map((prediction) => predictionToPlace(prediction)),
}
