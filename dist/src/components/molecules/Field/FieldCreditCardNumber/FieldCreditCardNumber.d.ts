import React from 'react';
import { TextFieldProps } from '@mui/material';
import { ControllerProps } from 'react-hook-form';
export interface IFieldCreditCardNumberProps extends Omit<ControllerProps, 'render'> {
    textFieldProps: TextFieldProps;
}
export declare const FieldCreditCardNumber: ({ name, control, defaultValue, shouldUnregister, rules, textFieldProps, }: IFieldCreditCardNumberProps) => React.JSX.Element;
