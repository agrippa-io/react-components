import { MouseEvent } from 'react'
import { IPlace } from '../../../../../../services'
export interface IPlaceListItemProps {
  place: IPlace
  onClick?: (event: MouseEvent) => void
}
