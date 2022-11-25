import React, { useCallback } from 'react'
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  TextField
} from '@mui/material'
import debounce from 'lodash/debounce'
import { AutocompleteProps } from "@mui/material/Autocomplete/Autocomplete";

export interface IAutocompleteAPIProps<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
  > extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'options' | 'renderInput'> {
  options?: T[]
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode
  debounceInterval?: number
  debounceOptions?: object
}

export function AutocompleteAPI<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
  >({
  options = [],
  getOptionLabel,
  renderOption,
  renderInput,
  onChange,
  onInputChange,
  debounceInterval = 250,
  debounceOptions = {},
  ...props
}: IAutocompleteAPIProps<T, Multiple, DisableClearable, FreeSolo>) {

  const onInputChangeDebounce = useCallback(
      debounce((event, query, reason) => {
        onInputChange && onInputChange(event, query, reason)
      }, debounceInterval, debounceOptions)
  , [onInputChange, debounceInterval, debounceOptions])

  const getOptionLabelFallback = (option: any) => option?.label ?? option

  // @ts-ignore
  const renderOptionFallback = (props, option, state) => {
    return (
      <Box component="li" key={option.id} {...props}>
        {option.label}
      </Box>
    )
  }

  const renderInputFallback = (params: AutocompleteRenderInputParams) => {
    return (
      <TextField {...params} placeholder='Search...' />
    )
  }

  return (
    <Autocomplete
      {...props}
      options={options}
      getOptionLabel={getOptionLabel ?? getOptionLabelFallback}
      renderOption={renderOption ?? renderOptionFallback}
      renderInput={renderInput ?? renderInputFallback}
      onChange={onChange}
      onInputChange={onInputChangeDebounce}
    />
  )
}
