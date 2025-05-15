import React from 'react'

import { Box, TextFieldProps, TextField } from '@mui/material'
import { Controller, ControllerProps } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { validateIsExpirationDate, validateIsExpirationDateCurrent } from '../../../../services'

export interface IFieldCreditCardExpirationProps extends Omit<ControllerProps, 'render'> {
  textFieldProps?: Omit<TextFieldProps, 'onChange' | 'onBlur' | 'onFocus'>
  inputMaskProps?: InputMask
}

export const FieldCreditCardExpiration = ({
  name,
  control,
  defaultValue,
  shouldUnregister,
  rules = {
    required: 'Expiration is required',
    validate: {
      validateIsExpirationDate,
      validateIsExpirationDateCurrent,
    },
  },
  textFieldProps,
  inputMaskProps,
}: IFieldCreditCardExpirationProps) => {
  const mergedInputMaskProps = {
    mask: '99/99',
    ...inputMaskProps,
  }
  const mergedTextFieldProps = {
    placeholder: 'MM/YY',
    ...textFieldProps,
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      rules={rules}
      render={({
        field: { name, value, onBlur, onChange /*, ref */ },
        fieldState: { error, invalid /* isTouched, isDirty */ },
      }) => {
        const errorMessage = error?.message
        const helperTextActive = errorMessage || mergedTextFieldProps?.helperText

        return (
          <Box sx={{ display: 'flex', alignItems: 'start' }}>
            <InputMask
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              {...mergedInputMaskProps}
            >
              {() => (
                <TextField
                  {...mergedTextFieldProps}
                  error={invalid}
                  aria-describedby={`${name}-helper-text`}
                  helperText={helperTextActive}
                />
              )}
            </InputMask>
          </Box>
        )
      }}
    />
  )
}
