import { TextFieldProps } from '@mui/material';
import { ControllerProps } from 'react-hook-form';
export interface IFieldTextProps extends Omit<ControllerProps, 'render'> {
    textFieldProps: TextFieldProps;
}
export declare const FieldText: ({ name, control, defaultValue, shouldUnregister, rules, textFieldProps, }: IFieldTextProps) => import("react").JSX.Element;
