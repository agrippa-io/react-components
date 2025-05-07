import React from 'react'

import { Box, TextFieldProps, TextField } from '@mui/material'
import { Controller, ControllerProps } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { REGEX_CREDIT_CARD_EXPIRATION_DATE } from '../../../../constants'

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
      isExpirationDate: (v) =>
        v === '__/__' ||
        v === 'MM/YY' ||
        REGEX_CREDIT_CARD_EXPIRATION_DATE.test(v) ||
        'Invalid expiration date format',
      isExpired: (v) => {
        let isExpirationCurrent = true
        const isPlaceholder = v === '__/__' || v === 'MM/YY'
        if (!isPlaceholder && v?.length === 5) {
          const today = new Date()
          const currentYear = parseInt(today.getFullYear().toString().slice(-2))
          const suppliedYear = parseInt(v.slice(-2))
          const isSuppliedYearMatchCurrentYear = suppliedYear == currentYear
          if (isSuppliedYearMatchCurrentYear) {
            const currenMonth = today.getMonth()
            const suppliedMonth = parseInt(v.substring(0, 2)) - 1
            isExpirationCurrent = suppliedMonth > currenMonth
          } else {
            isExpirationCurrent = suppliedYear >= currentYear
          }
        }

        return isExpirationCurrent || 'Expired'
      },
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
