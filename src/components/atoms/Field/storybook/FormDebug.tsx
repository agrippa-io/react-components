import { Children, ReactNode } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@mui/material'
import {FieldText} from "../FieldText";

export interface IFormDebugProps {
  children?: ReactNode
}

export const FormDebug = ({
}: IFormDebugProps) => {
  const methods = useForm()
  const onSubmit = (data: any) => console.log('Form Data', data)


  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FieldText
          name={'numberInteger'}
          control={methods.control}
        />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
)
}
