import isEmpty from 'lodash'
import { FormHelperText, FormHelperTextProps } from '@mui/material'
import * as React from "react";

export interface IFieldHelperTextProps extends FormHelperTextProps {
  name: string
}

export function FieldHelperText({
  name,
  classes,
  sx,
  variant,
  children,
  error,
  disabled,
  filled,
  focused,
  margin,
  required,
}: IFieldHelperTextProps) {

  // if (isEmpty(children)) {
  //   return null
  // }

  return (
    <FormHelperText
      id={`${name}-helper-text`}
      classes={classes}
      sx={sx}
      variant={variant}
      error={error}
      disabled={disabled}
      filled={filled}
      focused={focused}
      margin={margin}
      required={required}
    >
      {children}
    </FormHelperText>
  )
}
