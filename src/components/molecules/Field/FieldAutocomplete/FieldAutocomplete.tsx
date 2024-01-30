import React, { useCallback } from 'react'
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  TextField,
  AutocompleteFreeSoloValueMapping,
} from '@mui/material'
import debounce from 'lodash/debounce'
import { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete'

export interface IAutocompleteOption {
  id: string | number
  label?: string
}

export interface IFieldAutocompleteProps<
  T = any,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
> extends Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    'options' | 'renderInput'
  > {
  options?: T[]
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode
  debounceInterval?: number
  debounceOptions?: object
}

export function FieldAutocomplete<
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
}: IFieldAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const onInputChangeDebounce = useCallback(
    debounce(
      (event, query, reason) => {
        onInputChange && onInputChange(event, query, reason)
      },
      debounceInterval,
      debounceOptions,
    ),
    [onInputChange, debounceInterval, debounceOptions],
  )

  const getOptionLabelFallback = (option: T | AutocompleteFreeSoloValueMapping<FreeSolo>): string =>
    // @ts-expect-error: Optionally Defined
    option?.label ?? option

  const renderOptionFallback = (props: any, option: T) => {
    return (
      // @ts-expect-error: Optionally Defined
      <Box component="li" key={option?.id} {...props}>
        {/* @ts-expect-error: Optionally Defined */}
        {option?.label}
      </Box>
    )
  }

  const renderInputFallback = (params: AutocompleteRenderInputParams) => {
    return <TextField {...params} placeholder="Search..." />
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
