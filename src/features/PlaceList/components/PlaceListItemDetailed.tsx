import React, { MouseEvent } from 'react'
import isEmpty from 'lodash/isEmpty'

import { IPlaceListItemProps } from '../@types'
import { ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import { IPlace } from '../../../services'

const subheaderFields = ['city', 'region', 'country']

export interface IPlaceListItemDetailed extends IPlaceListItemProps {}

export function PlaceListItemDetailed({
  place,
  onClick = () => {},
}: IPlaceListItemDetailed) {
  const forwardEventWithTargetValue = (e: MouseEvent) => {
    onClick({
      ...e,
      target: {
        ...e.target,
        value: place
      }
    } as MouseEvent)
  }

  const subheaderText = () => subheaderFields.reduce((acc, key) => {
    const value: string = place[key as keyof IPlace] as string

    if (!isEmpty(value)) {
      acc.push(value)
    }

    return acc
  }, [] as string[]).join(', ')

  return (
    <ListItemButton onClick={forwardEventWithTargetValue}>
      <ListItemText>
        { place?.businessName ?? 'No Business' }
      </ListItemText>
      <ListSubheader>
        { subheaderText() }
      </ListSubheader>
    </ListItemButton>
  )
}
