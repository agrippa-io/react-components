import React, { SyntheticEvent, useState, useEffect } from 'react'

import { GooglePlacesAutocompleteService } from '../../../../services/GoogleMap'

import { FieldAutocomplete } from '../../index'
import { AutocompleteRenderInputParams, Box, TextField } from '@mui/material'
import { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete'
import { IMapGoogleConfig } from '../MapGoogle'

export interface IGooglePlacesAutocompleteProps<
  T extends google.maps.places.AutocompletePrediction = google.maps.places.AutocompletePrediction,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
> extends Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    'options' | 'renderInput'
  > {
  config: IMapGoogleConfig
  request?: google.maps.places.AutocompletionRequest
  options?: T[]
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode
}

export function GooglePlacesAutocomplete<
  T extends google.maps.places.AutocompletePrediction = google.maps.places.AutocompletePrediction,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>(props: IGooglePlacesAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const [autocompleteService, setAutocompleteService] = useState<GooglePlacesAutocompleteService>()
  const [autocompleteOptions, setAutocompleteOptions] = useState<any[]>([])

  useEffect(() => {
    initService()
  }, [])

  const initService = async () => {
    try {
      const service = new GooglePlacesAutocompleteService({
        loaderOptions: {
          apiKey: props.config.apiKey,
        },
      })

      await service.init()

      setAutocompleteService(service)
    } catch (err) {
      console.error('Failed to initialize GooglePlacesService', err)
    }
  }

  const onInputChange = async (event: SyntheticEvent, value: any, reason: any) => {
    if (!value) {
      props.onInputChange && props.onInputChange(event, value, reason)
      return
    }

    if (!autocompleteService) {
      console.warn('GooglePlacesService - Not Initialized')
      props.onInputChange && props.onInputChange(event, value, reason)
      return
    }

    try {
      const { predictions } = await autocompleteService.getPlacePredictions({
        ...(props?.request ?? {}),
        input: value,
      })

      setAutocompleteOptions(predictions ?? [])

      props.onInputChange && props.onInputChange(event, value, reason)
    } catch (err) {
      console.error('Failed to fetch Google Places Autocomplete results', err)
    }
  }

  const getOptionLabel = (option: any) => (typeof option === 'string' ? option : option.description)

  const filterOptions = (option: any) => option

  const isOptionEqualToValue = (option: T, value: T) => {
    return option?.place_id === value?.place_id
  }

  const renderOptionFallback = (props: any, option: T) => {
    return (
      <Box component="li" key={option.id} {...props}>
        {option.description}
      </Box>
    )
  }

  const renderInputFallback = (params: AutocompleteRenderInputParams) => {
    return <TextField {...params} placeholder="Search..." />
  }

  return (
    <FieldAutocomplete
      {...props}
      options={autocompleteOptions}
      filterOptions={props?.filterOptions ?? filterOptions}
      getOptionLabel={props?.getOptionLabel ?? getOptionLabel}
      isOptionEqualToValue={props?.isOptionEqualToValue ?? isOptionEqualToValue}
      onInputChange={onInputChange}
      renderOption={props?.renderOption ?? renderOptionFallback}
      renderInput={props?.renderInput ?? renderInputFallback}
      autoComplete
      includeInputInList
      filterSelectedOptions
    />
  )
}
