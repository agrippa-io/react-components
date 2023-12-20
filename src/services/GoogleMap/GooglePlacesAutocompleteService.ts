import { GoogleMapService, IGoogleMapServiceProps } from './GoogleMapService'

export class GooglePlacesAutocompleteService extends GoogleMapService {
  api?: google.maps.places.AutocompleteService

  constructor({ loaderOptions }: IGoogleMapServiceProps) {
    super({
      loaderOptions: {
        ...loaderOptions,
        libraries: ['places'],
      },
    })

    this.api = undefined
  }

  async init() {
    if (!this.api) {
      await super.init()

      if (!this.google) {
        throw new Error('Failed to load Google Client')
      }

      this.api = new this.google.maps.places.AutocompleteService()
    }
  }

  async getPlacePredictions(
    request: google.maps.places.AutocompletionRequest,
  ): Promise<google.maps.places.AutocompleteResponse> {
    if (!this.api) {
      throw new Error(
        'The google.maps.places.AutocompleteService has not been initialized, try calling GooglePlacesAutocompleteService.init()',
      )
    }

    return this.api.getPlacePredictions(request)
  }
}
