import { ComponentStory, ComponentMeta } from '@storybook/react'

import { FieldText } from '../FieldText'
import { FormProvider, useForm } from "react-hook-form";
import { Box, Button } from "@mui/material";
import { ReactHookFormStatePane } from "../../../organisms/ReactHookFormStatePane";
import {validateFloat, validateInteger, validateNumber, validateMinChar, validateMaxChar, validateRangeChar} from "../../../../services";

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
  title: 'Components / atoms / Field',
  component: FieldText
} as ComponentMeta<typeof FieldText>

export const FieldNumberComponent: ComponentStory<typeof FieldText> = (args) => {
  const methods = useForm({
    mode: "onChange"
  })
  const onSubmit = (data: any) => console.log('Form Data', data)

  return (
    <FormProvider {...methods}>
      <Box sx={sxContainerRoot}>
        <Box sx={sxContainerPane}>

            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <FieldText
                {...args}
              />

              <Button type="submit">Submit</Button>
            </form>
        </Box>
        <ReactHookFormStatePane sx={sxContainerPane} />
      </Box>
    </FormProvider>
  )
}

FieldNumberComponent.args = {
  name: 'numberField',
  rules: {
    // @ts-ignore
    // validate: validateMinChar({ min: 5 }),
    // validate: validateMaxChar({ max: 10 }),
    validate: validateRangeChar({ min: 5, max: 10 })
    // validate: validateFloat({}),
    // validate: validateNumber({}),
    // validate: validateInteger({}),
  }
}
