import { GoogleMapService, IGoogleMapServiceProps } from "./GoogleMapService";

export class GooglePlacesAutocompleteService extends GoogleMapService {
  api: google.maps.places.AutocompleteService;

  constructor({ loaderOptions }: IGoogleMapServiceProps) {
    super({
      loaderOptions: {
        ...loaderOptions,
        libraries: ["places"],
      },
    });
  }

  async init() {
    if (!this.api) {
      await super.init();
      this.api = new this.google.maps.places.AutocompleteService();
    }
  }

  async getPlacePredictions(
    request: google.maps.places.AutocompletionRequest,
  ): Promise<google.maps.places.AutocompleteResponse> {
    return this.api.getPlacePredictions(request);
  }
}
