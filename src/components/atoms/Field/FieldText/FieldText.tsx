import {TextFieldProps, TextField, } from '@mui/material'
import { Controller, ControllerProps, } from 'react-hook-form'

export interface IFieldTextProps extends Omit<ControllerProps, 'render'> {
  textFieldProps: TextFieldProps
}

export const FieldText = ({
  name,
  control,
  defaultValue,
  shouldUnregister,
  rules = {},
  textFieldProps = {},
}: IFieldTextProps) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    shouldUnregister={shouldUnregister}
    rules={rules}
    render={({
      field: { name, value, onBlur, onChange, ref },
      fieldState: { error, invalid, isTouched, isDirty },
    }) => {

      const errorMessage = error?.message
      const helperTextActive = errorMessage || textFieldProps?.helperText

      return (
        <TextField
          {...textFieldProps}
          inputProps={textFieldProps?.inputProps}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          inputRef={ref}
          error={invalid}
          aria-describedby={`${name}-helper-text`}
          helperText={helperTextActive}
        />
      )
    }}
  />
)
