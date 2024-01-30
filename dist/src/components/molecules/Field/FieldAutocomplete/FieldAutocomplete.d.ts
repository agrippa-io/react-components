import React from 'react'
import { AutocompleteRenderInputParams } from '@mui/material'
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
export declare function FieldAutocomplete<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>({
  options,
  getOptionLabel,
  renderOption,
  renderInput,
  onChange,
  onInputChange,
  debounceInterval,
  debounceOptions,
  ...props
}: IFieldAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>): React.JSX.Element
