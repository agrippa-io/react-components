import isEmpty from 'lodash/isEmpty'
import { IPlace } from '../../@types'
import { PredictionDescriptionKeyOrder } from './@types'
import { IPlacePrediction } from '../../@types/interfaces/IPlacePrediction'

export function predictionToPlace(
  prediction: IPlacePrediction,
  descriptionKeyOrder: Record<string, string[]> = PredictionDescriptionKeyOrder,
): IPlace {
  const place: IPlace = {
    place_id: prediction?.place_id,
  }
  if (isEmpty(prediction?.description)) {
    return {} as IPlace
  }

  const placeNodes: string[] = prediction?.description.split(', ').reverse()

  const countryKey: string = placeNodes[0]
  const countryPredictionDescriptionOrder: string[] = descriptionKeyOrder[countryKey]

  if (isEmpty(countryPredictionDescriptionOrder)) {
    throw new Error(
      `Unhandled Country['${countryKey}'] in descriptionKeyOrder['${descriptionKeyOrder}']`,
    )
  }

  return placeNodes.reduce((placeObject, node, index) => {
    const key: keyof IPlace = countryPredictionDescriptionOrder[index] as keyof IPlace
    placeObject[key] = node

    return placeObject
  }, place)
}
