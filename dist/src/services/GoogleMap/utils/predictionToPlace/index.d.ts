import { IPlace } from '../../@types'
import { IPlacePrediction } from '../../@types/interfaces/IPlacePrediction'
export declare function predictionToPlace(
  prediction: IPlacePrediction,
  descriptionKeyOrder?: Record<string, string[]>,
): IPlace
