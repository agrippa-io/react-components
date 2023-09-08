import { ComponentStory, ComponentMeta } from '@storybook/react'

import { FieldText } from '../FieldText'
import { FormProvider, useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import { ReactHookFormStatePane } from "../../../../organisms/ReactHookFormStatePane";
import {validateFloat, validateInteger, validateNumber,} from "../../../../../services";
import { argTypesTextField } from '../../../../../constants';


const sxContainerRoot = {
  display: 'flex',
  direction: 'row',
  flexBasis: '100%',
}

const sxContainerPane = {
  display: 'flex',
  direction: 'column',
  flexBasis: '50%',
}

export default {
  title: 'Components / atoms / Field / FieldText / Number',
  component: FieldText,
  argTypes: argTypesTextField,
} as ComponentMeta<typeof FieldText>

export const FieldTextNumberComponent: ComponentStory<typeof TextField> = (args) => {
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
                name="fieldNumber"
                rules={{
                  validate: validateNumber({}),
                }}
                textFieldProps={{
                  label: 'Number',
                  helperText: 'Enter a number',
                  ...args,
                  inputProps: {
                    placeholder: 'Enter a number',
                    ...(args?.inputProps ?? {}),
                  },
                }}
              />

              <FieldText
                name="fieldInt"
                rules={{
                  validate: validateInteger({}),
                }}
                textFieldProps={{
                  label: 'Integer',
                  helperText: 'Enter a integer',
                  ...args,
                  inputProps: {
                    placeholder: 'Enter a integer',
                    ...(args?.inputProps ?? {}),
                  },
                }}
              />

              <FieldText
                name="fieldFloat"
                rules={{
                  validate: validateFloat({}),
                }}
                textFieldProps={{
                  label: 'Float',
                  helperText: 'Enter a float',
                  ...args,
                  inputProps: {
                    placeholder: 'Enter a float',
                    ...(args?.inputProps ?? {}),
                  },
                }}
              />

              <Button type="submit">Submit</Button>
            </form>
        </Box>
        <ReactHookFormStatePane sx={sxContainerPane} />
      </Box>
    </FormProvider>
  )
}
