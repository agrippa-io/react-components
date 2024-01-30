/// <reference types="google.maps" />
/// <reference types="googlemaps" />
import React from 'react';
import { AutocompleteRenderInputParams } from '@mui/material';
import { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete';
import { IMapGoogleConfig } from '../MapGoogle';
export interface IGooglePlacesAutocompleteProps<T extends google.maps.places.AutocompletePrediction = google.maps.places.AutocompletePrediction, Multiple extends boolean | undefined = undefined, DisableClearable extends boolean | undefined = undefined, FreeSolo extends boolean | undefined = undefined> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'options' | 'renderInput'> {
    config: IMapGoogleConfig;
    request?: google.maps.places.AutocompletionRequest;
    options?: T[];
    renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
}
export declare function GooglePlacesAutocomplete<T extends google.maps.places.AutocompletePrediction = google.maps.places.AutocompletePrediction, Multiple extends boolean | undefined = undefined, DisableClearable extends boolean | undefined = undefined, FreeSolo extends boolean | undefined = undefined>(props: IGooglePlacesAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>): React.JSX.Element;
