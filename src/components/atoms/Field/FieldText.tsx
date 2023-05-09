import isEmpty from 'lodash'
import { Input, InputLabel, FormHelperTextProps, TextFieldProps } from '@mui/material'
import { Controller, ControllerProps, } from 'react-hook-form'
import { FieldHelperText } from './FieldHelperText'

export interface IFieldNumberProps extends Omit<ControllerProps, 'render'> {
  textFieldProps?: TextFieldProps
  helperTextProps?: FormHelperTextProps
}

export const FieldText = ({
  name,
  control,
  defaultValue,
  shouldUnregister,
  rules = {},
  textFieldProps = {},
  helperTextProps = {},
}: IFieldNumberProps) => {
  return (
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
        const helperText = errorMessage || textFieldProps?.helperText || ''

        return (
          <>
            <InputLabel htmlFor={name}>{textFieldProps?.label}</InputLabel>
            <Input
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              inputRef={ref}
              error={invalid}
              aria-describedby={`${name}-helper-text`}
            />
            <FieldHelperText name={name} {...helperTextProps} error={invalid}>
              { isEmpty(errorMessage) ? helperText : errorMessage }
            </FieldHelperText>
          </>
        )
      }}
    />
  )
}
