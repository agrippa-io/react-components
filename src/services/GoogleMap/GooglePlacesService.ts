import {GoogleMapService, IGoogleMapServiceProps} from './GoogleMapService'


export class GooglePlacesService extends GoogleMapService {
  // @ts-ignore
  apiAutocomplete: google.maps.places.AutocompleteService

  constructor({ loaderOptions }: IGoogleMapServiceProps) {
    super({
      loaderOptions: {
        ...loaderOptions,
        libraries: ['places']
      }
    });
  }

  async init() {
    if (!this.apiAutocomplete) {
      await super.init()
      this.apiAutocomplete = new this.google.maps.places.AutocompleteService()
    }
  }

  async getPlacePredictions(request: google.maps.places.AutocompletionRequest): Promise<google.maps.places.AutocompleteResponse> {
    return this.apiAutocomplete.getPlacePredictions(request)
  }
}
