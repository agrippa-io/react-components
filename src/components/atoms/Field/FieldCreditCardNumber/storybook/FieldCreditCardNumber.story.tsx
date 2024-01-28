import { ComponentStory, ComponentMeta } from '@storybook/react'

import { FieldCreditCardNumber } from '../FieldCreditCardNumber'
import { FormProvider, useForm } from 'react-hook-form'
import { Box, Button, TextField } from '@mui/material'
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
  title: 'Components / atoms / Field / FieldCreditCard / FieldCreditCardNumber',
  component: FieldCreditCardNumber,
  argTypes: argTypesTextField,
} as ComponentMeta<typeof FieldCreditCardNumber>

export const FieldTextStringComponent: ComponentStory<typeof TextField> = (args) => {
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
              <FieldCreditCardNumber
                name="credit-card-number"
                textFieldProps={{
                  label: 'Card Number',
                  helperText: 'Card Number',
                  ...args,
                  inputProps: {
                    placeholder: '4444 4444 4444 4444',
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
