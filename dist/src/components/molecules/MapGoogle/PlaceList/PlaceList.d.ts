/// <reference types="google.maps" />
/// <reference types="googlemaps" />
import React, { MouseEvent, FunctionComponent } from 'react'
import { IPlaceListItemProps } from './@types'
export interface IPlaceListProps {
  places: google.maps.places.AutocompletePrediction[]
  ListItemComponent: FunctionComponent<IPlaceListItemProps>
  onClick: (event: MouseEvent) => void
}
export declare function PlaceList({
  places,
  ListItemComponent,
  onClick,
}: IPlaceListProps): React.JSX.Element
