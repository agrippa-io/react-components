import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { FieldCreditCardExpiration } from '../FieldCreditCardExpiration'
import { FormProvider, useForm } from 'react-hook-form'
import { Box, Button } from '@mui/material'
import { ReactHookFormStatePane } from '../../../../organisms/ReactHookFormStatePane'
import { argTypesTextField } from '../../FieldText/storybook/TextField.argTypes'

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
}

const sxRow = {
  display: 'flex',
  direction: 'row',
  width: '100%',
}

export default {
  title: 'Components / molecules / Field / FieldCreditCard / FieldCreditCardExpiration',
  component: FieldCreditCardExpiration,
  argTypes: argTypesTextField,
} as ComponentMeta<typeof FieldCreditCardExpiration>

export const FieldCreditCardExpirationStory: ComponentStory<typeof FieldCreditCardExpiration> = (
  args,
) => {
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
              <FieldCreditCardExpiration
                name="credit-card-expiration"
                textFieldProps={{
                  label: 'Expiration',
                  helperText: 'Expiration',
                  ...args,
                  inputProps: {
                    placeholder: 'MM/YY',
                    // @ts-expect-error Need to figure out how to type this
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
