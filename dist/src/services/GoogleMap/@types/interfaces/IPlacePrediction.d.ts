/// <reference types="google.maps" />
/// <reference types="googlemaps" />
export interface IPlacePrediction extends Omit<google.maps.places.AutocompletePrediction, 'reference'> {
    reference?: string;
}
