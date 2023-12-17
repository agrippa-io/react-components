import React, { MouseEvent, FunctionComponent } from 'react'

import { IPlaceListItemProps } from './@types'
import { List } from '@mui/material'
import { PlaceListItemSimple } from './components/PlaceListItemSimple'

export interface IPlaceListProps {
  places: google.maps.places.AutocompletePrediction[]
  ListItemComponent: FunctionComponent<IPlaceListItemProps>
  onClick: (event: MouseEvent) => void
}

export function PlaceList({
  places,
  ListItemComponent = PlaceListItemSimple,
  onClick = () => {},
}: IPlaceListProps) {
  return (
    <List>
      {places.map((place) => (
        <ListItemComponent key={place.id} place={place} onClick={onClick} />
      ))}
    </List>
  )
}
