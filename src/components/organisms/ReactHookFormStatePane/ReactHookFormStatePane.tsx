import { useFormState, Control } from "react-hook-form"
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import {TableFields, FormStateTable} from './components'

const sxAccordionBody = {
  backgroundColor: '#666666',
}

export interface ReactHookFormStatePaneProps {
  sx?: any
  control?: Control
  name?: string
  disabled?: boolean
  exact?: boolean
}

export const ReactHookFormStatePane = ({
  sx,
  control,
  name,
  disabled,
  exact,
}: ReactHookFormStatePaneProps) => {
  const {
    isDirty,
    dirtyFields,
    touchedFields,
    defaultValues,
    isSubmitted,
    isSubmitSuccessful,
    isSubmitting,
    isLoading,
    submitCount,
    isValid,
    isValidating,
    errors,
  } = useFormState({
    control,
    name,
    disabled,
    exact
  });

  // const renderStateAccordion = (name: string, state: Record<any, any>) => {
  //   console.log('renderStateAccordion', {
  //     name,
  //     state
  //   });
  //   return (
  //     <Accordion sx={{ width: '100%' }} defaultExpanded={true}>
  //       <AccordionSummary>
  //         <Typography>{name}</Typography>
  //       </AccordionSummary>
  //
  //       <AccordionDetails sx={sxAccordionBody}>
  //         {/*{renderFieldTable(name, state)}*/}
  //         <TableFields
  //           name={name}
  //           state={state}
  //           emptyMessage="No State"
  //         />
  //       </AccordionDetails>
  //     </Accordion>
  //   )
  // }

  return (
    <Box sx={{
      ...sx,
      flexDirection: 'column',
    }}>
      <FormStateTable
        isDirty={isDirty}
        isSubmitted={isSubmitted}
        isSubmitSuccessful={isSubmitSuccessful}
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        submitCount={submitCount}
        isValid={isValid}
        isValidating={isValidating}
      />
      {/*{renderStateAccordion('Errors', errors)}*/}
    </Box>
  )
}
