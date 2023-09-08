import { ComponentStory, ComponentMeta } from '@storybook/react'

import { FieldText } from '../FieldText'
import { FormProvider, useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import { ReactHookFormStatePane } from "../../../../organisms/ReactHookFormStatePane";
import {
  validateIPv6String,
  validateIPv6RangeString,
  validateIPv6CidrNotation,
  validateIPv6CidrRange,
  validateIPv6Mask,
  validateIPv6Number,
  validateIPv6Hexadecatet,
} from "../../../../../services";
import {argTypesTextField} from "../../../../../constants";

const sxContainerRoot = {
  display: 'flex',
  direction: 'row',
  flexBasis: '100%',
}

const sxContainerPane = {
  display: 'flex',
  direction: 'column',
  flexBasis: '50%',
  margin: '0 5px'
}

export default {
  title: 'Components / atoms / Field / FieldText / IP',
  name: 'IPv6',
  component: FieldText,
  argTypes: argTypesTextField,
} as ComponentMeta<typeof FieldText>

// TODO - Replace placeholders with valid examples
export const FieldTextIPv6Components: ComponentStory<typeof TextField> = (args) => {
  const formProviderProps = useForm({
    mode: "onChange"
  })
  const onSubmit = (data: any) => console.log('Form Data', data)

  return (
    <FormProvider {...formProviderProps}>
      <Box sx={sxContainerRoot}>
        <Box sx={sxContainerPane}>
          <form onSubmit={formProviderProps.handleSubmit(onSubmit)}>

            <FieldText
              name="ipv6String"
              rules={{
                validate: validateIPv6String,
              }}
              textFieldProps={{
                label: 'IPv6 String',
                helperText: 'Enter an IPv6 String',
                ...args,
                inputProps: {
                  placeholder: 'ex: 127.0.0.1',
                  ...args.inputProps,
                },
              }}
            />

            <FieldText
              name="ipv6Range"
              rules={{
                validate: validateIPv6RangeString,
              }}
              textFieldProps={{
                label: 'IPv6 Range',
                helperText: 'Enter an IPv6 Range',
                ...args,
                inputProps: {
                  placeholder: 'ex: 1.0.0.0-1.2.3.4',
                  ...args.inputProps,
                },
              }}
            />

            <FieldText
              name="ipv6CidrNotation"
              rules={{
                validate: validateIPv6CidrNotation,
              }}
              textFieldProps={{
                label: 'IPv6 Cidr Notation',
                helperText: 'Enter an IPv6 Cidr Notation',
                ...args,
                inputProps: {
                  placeholder: 'ex: 127.0.0.1/10',
                  ...args.inputProps,
                },
              }}
            />

            <FieldText
              name="ipv6CidrRange"
              rules={{
                validate: validateIPv6CidrRange,
              }}
              textFieldProps={{
                label: 'IPv6 Cidr Range',
                helperText: 'Enter an IPv6 Cidr Range',
                ...args,
                inputProps: {
                  placeholder: 'ex: 127.0.0.0/10',
                  ...args.inputProps,
                },
              }}
            />

            <FieldText
              name="ipv6Mask"
              rules={{
                validate: validateIPv6Mask,
              }}
              textFieldProps={{
                label: 'IPv6 Mask',
                helperText: 'Enter an IPv6 Mask',
                ...args,
                inputProps: {
                  placeholder: 'ex: 255.255.255.0',
                  ...args.inputProps,
                },
              }}
            />

            <FieldText
              name="ipv6Number"
              rules={{
                validate: validateIPv6Number,
              }}
              textFieldProps={{
                label: 'IPv6 Number',
                helperText: 'Enter an IPv6 Number',
                ...args,
                inputProps: {
                  placeholder: '127.0.0.1',
                  ...args.inputProps,
                },
              }}
            />

            <FieldText
              name="ipv6Hexadecatet"
              rules={{
                validate: validateIPv6Hexadecatet,
              }}
              textFieldProps={{
                label: 'IPv6 Hexadecatet',
                helperText: 'Enter an IPv6 Hexadecatet',
                ...args,
                inputProps: {
                  placeholder: '255',
                  ...args.inputProps,
                },
              }}
            />

            <Button
              type="submit"
              variant="outlined"
              sx={{
                marginTop: '10px'
              }}
              fullWidth
            >
              Submit
            </Button>
          </form>
        </Box>
        <ReactHookFormStatePane sx={sxContainerPane} />
      </Box>
    </FormProvider>
  )
}

FieldTextIPv6Components.storyName = 'IPv6'
