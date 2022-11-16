import React, { useState, useEffect, useCallback } from 'react'
import {Autocomplete, AutocompleteRenderInputParams, Box, TextField} from '@mui/material'
import debounce from 'lodash/debounce'

const options = [
  {
    id: 0,
    label: 'Alpha'
  },
  {
    id: 1,
    label: 'Beta'
  },
  {
    id: 2,
    label: 'Chelsey'
  },
]

export interface IMapGoogleSearchFieldProps {
  initialValue?: string
  onChangeSearch?: (query: string) => void
  debounceInterval?: number
  debounceOptions?: object
}

export function MapGoogleSearchField({
  initialValue = '',
  onChangeSearch = (query: string) => {
    console.log('query ==>', query)
  },
  debounceInterval = 250,
  debounceOptions = {},
}: IMapGoogleSearchFieldProps) {
  const [searchValue, setSearchValue] = useState<string>(initialValue)
  const [autocompleteOptions, setAutocompleteOptions] = useState([])

  const onChangeDebounceFetchAutocompleteOptions = useCallback(
      debounce((query) => {
        onChangeSearch(query)
      }, debounceInterval, debounceOptions)
  , [onChangeSearch, debounceInterval, debounceOptions])

  useEffect(() => {
    console.log('searchValue ==>', searchValue)
  }, [searchValue])

  // @ts-ignore
  const renderOption = (props, option, state) => {
    return (
      <Box component="li" key={option.id} {...props}>
        {option.label}
      </Box>
    )
  }

  const renderInput = (params: AutocompleteRenderInputParams) => {
    return (
      <TextField {...params} placeholder='Search...' />
    )
  }

  return (
    <Autocomplete
      // options={autocompleteOptions}
      options={options}
      renderOption={renderOption}
      renderInput={renderInput}
    />
  )
}
