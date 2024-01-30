import React from 'react'

import { Box, TextFieldProps, TextField } from '@mui/material'
import { Controller, ControllerProps } from 'react-hook-form'
import CreditCardType from 'credit-card-type'
import { IconCreditCardLogo } from '../../../atoms/Icons'

export interface IFieldCreditCardNumberProps extends Omit<ControllerProps, 'render'> {
  textFieldProps: TextFieldProps
}

export const FieldCreditCardNumber = ({
  name,
  control,
  defaultValue,
  shouldUnregister,
  rules = {},
  textFieldProps = {},
}: IFieldCreditCardNumberProps) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    shouldUnregister={shouldUnregister}
    rules={rules}
    render={({
      field: { name, value, onBlur, onChange, ref },
      fieldState: { error, invalid /* isTouched, isDirty */ },
    }) => {
      const errorMessage = error?.message
      const helperTextActive = errorMessage || textFieldProps?.helperText

      const cardType = CreditCardType(value)

      const startAdornmentCardType = (cardType: any[]) => {
        if (!cardType || !cardType.length || cardType.length > 1) {
          return null
        }

        const card = cardType[0]

        return (
          <IconCreditCardLogo height={45} width={70} iconStyle="flat-rounded" company={card.type} />
        )
      }

      return (
        <Box sx={{ display: 'flex', alignItems: 'start' }}>
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
          <Box sx={{ display: 'flex', margin: '5px 10px' }}>{startAdornmentCardType(cardType)}</Box>
        </Box>
      )
    }}
  />
)
