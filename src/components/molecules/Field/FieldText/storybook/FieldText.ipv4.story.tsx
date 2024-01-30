import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { FieldText } from '../FieldText'
import { FormProvider, useForm } from 'react-hook-form'
import { Box, Button, TextField } from '@mui/material'
import { ReactHookFormStatePane } from '../../../../organisms/ReactHookFormStatePane'
import {
  validateIPv4String,
  validateIPv4RangeString,
  validateIPv4CidrNotation,
  validateIPv4CidrRange,
  validateIPv4Mask,
  validateIPv4Number,
  validateIPv4Octet,
} from '../../../../../services'
import { argTypesTextField } from './TextField.argTypes'

const sxContainerRoot = {
  display: 'flex',
  direction: 'row',
  flexBasis: '100%',
}

const sxContainerPane = {
  display: 'flex',
  direction: 'column',
  flexBasis: '50%',
  margin: '0 5px',
  width: '100%',
}

const sxRow = {
  display: 'flex',
  direction: 'row',
  width: '100%',
}

export default {
  title: 'Components / molecules / Field / FieldText / IP',
  name: 'IPv4',
  component: FieldText,
  argTypes: argTypesTextField,
  args: {
    inputArgs: {
      fullWidth: false,
    },
  },
} as ComponentMeta<typeof FieldText>

// TODO - Replace placeholders with valid examples
export const FieldTextIPv4Components: ComponentStory<typeof TextField> = (args) => {
  const formProviderProps = useForm({
    mode: 'onChange',
  })
  const onSubmit = (data: any) => console.log('Form Data', data)

  return (
    <FormProvider {...formProviderProps}>
      <Box sx={sxContainerRoot}>
        <Box sx={sxContainerPane}>
          <form style={{ width: '100%' }} onSubmit={formProviderProps.handleSubmit(onSubmit)}>
            <Box sx={sxRow}>
              <FieldText
                name="ipv4String"
                rules={{
                  validate: validateIPv4String,
                }}
                textFieldProps={{
                  label: 'IPv4 String',
                  helperText: 'Enter an IPv4 String',
                  ...args,
                  inputProps: {
                    placeholder: 'ex: 127.0.0.1',
                    ...args.inputProps,
                  },
                }}
              />
            </Box>

            <Box sx={sxRow}>
              <FieldText
                name="ipv4Range"
                rules={{
                  validate: validateIPv4RangeString,
                }}
                textFieldProps={{
                  label: 'IPv4 Range',
                  helperText: 'Enter an IPv4 Range',
                  ...args,
                  inputProps: {
                    placeholder: 'ex: 1.0.0.0-1.2.3.4',
                    ...args.inputProps,
                  },
                }}
              />
            </Box>

            <Box sx={sxRow}>
              <FieldText
                name="ipv4CidrNotation"
                rules={{
                  validate: validateIPv4CidrNotation,
                }}
                textFieldProps={{
                  label: 'IPv4 Cidr Notation',
                  helperText: 'Enter an IPv4 Cidr Notation',
                  ...args,
                  inputProps: {
                    placeholder: 'ex: 127.0.0.1/10',
                    ...args.inputProps,
                  },
                }}
              />
            </Box>

            <Box sx={sxRow}>
              <FieldText
                name="ipv4CidrRange"
                rules={{
                  validate: validateIPv4CidrRange,
                }}
                textFieldProps={{
                  label: 'IPv4 Cidr Range',
                  helperText: 'Enter an IPv4 Cidr Range',
                  ...args,
                  inputProps: {
                    placeholder: 'ex: 127.0.0.0/10',
                    ...args.inputProps,
                  },
                }}
              />
            </Box>

            <Box sx={sxRow}>
              <FieldText
                name="ipv4Mask"
                rules={{
                  validate: validateIPv4Mask,
                }}
                textFieldProps={{
                  label: 'IPv4 Mask',
                  helperText: 'Enter an IPv4 Mask',
                  ...args,
                  inputProps: {
                    placeholder: 'ex: 255.255.255.0',
                    ...args.inputProps,
                  },
                }}
              />
            </Box>

            <Box sx={sxRow}>
              <FieldText
                name="ipv4Number"
                rules={{
                  validate: validateIPv4Number,
                }}
                textFieldProps={{
                  label: 'IPv4 Number',
                  helperText: 'Enter an IPv4 Number',
                  ...args,
                  inputProps: {
                    placeholder: '127.0.0.1',
                    ...args.inputProps,
                  },
                }}
              />
            </Box>

            <Box sx={sxRow}>
              <FieldText
                name="ipv4Octet"
                rules={{
                  validate: validateIPv4Octet,
                }}
                textFieldProps={{
                  label: 'IPv4 Octet',
                  helperText: 'Enter an IPv4 Octet',
                  ...args,
                  inputProps: {
                    placeholder: '255',
                    ...args.inputProps,
                  },
                }}
              />
            </Box>

            <Box sx={sxRow}>
              <Button
                type="submit"
                variant="outlined"
                sx={{
                  marginTop: '10px',
                }}
                fullWidth
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
        <ReactHookFormStatePane sx={sxContainerPane} />
      </Box>
    </FormProvider>
  )
}

FieldTextIPv4Components.storyName = 'IPv4'
