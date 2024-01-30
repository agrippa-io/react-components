/// <reference types="google.maps" />
/// <reference types="googlemaps" />
import React from 'react'
import { IGooglePlacesAutocompleteProps } from '../GooglePlacesAutocomplete'
declare const _default: import('@storybook/types').ComponentAnnotations<
  import('@storybook/react/dist/types-0fc72a6d').R,
  IGooglePlacesAutocompleteProps<
    google.maps.places.AutocompletePrediction,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >
>
export default _default
export declare const AutocompleteAPIOverview: (
  args: IGooglePlacesAutocompleteProps,
) => React.JSX.Element
