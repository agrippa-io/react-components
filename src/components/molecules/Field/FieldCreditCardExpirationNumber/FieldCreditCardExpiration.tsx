import React from 'react'

import { Box, TextFieldProps, TextField } from '@mui/material'
import { Controller, ControllerProps } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { REGEX_CREDIT_CARD_EXPIRATION_DATE } from '../../../../constants'

export interface IFieldCreditCardExpirationProps extends Omit<ControllerProps, 'render'> {
  textFieldProps: TextFieldProps
  mask?: string
  formatChars?: Record<string, string>
}

export const FieldCreditCardExpiration = ({
  name,
  control,
  defaultValue,
  shouldUnregister,
  rules = {
    required: 'Expiration is required',
    validate: {
      isExpirationDate: (v) =>
        v === '__/__' ||
        REGEX_CREDIT_CARD_EXPIRATION_DATE.test(v) ||
        'Invalid expiration date format',
    },
  },
  textFieldProps = {
    placeholder: 'MM/YY',
  },
  mask = '99/99',
  // formatChars = { '0': '[0-9]' },
}: IFieldCreditCardExpirationProps) => {
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
        const helperTextActive = errorMessage || textFieldProps?.helperText

        return (
          <Box sx={{ display: 'flex', alignItems: 'start' }}>
            <InputMask name={name} mask={mask} value={value} onChange={onChange} onBlur={onBlur}>
              {() => (
                <TextField
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
