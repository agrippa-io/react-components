/// <reference types="google.maps" />
/// <reference types="googlemaps" />
import { GoogleMapService, IGoogleMapServiceProps } from './GoogleMapService';
export declare class GooglePlacesAutocompleteService extends GoogleMapService {
    api?: google.maps.places.AutocompleteService;
    constructor({ loaderOptions }: IGoogleMapServiceProps);
    init(): Promise<void>;
    getPlacePredictions(request: google.maps.places.AutocompletionRequest): Promise<google.maps.places.AutocompleteResponse>;
}
