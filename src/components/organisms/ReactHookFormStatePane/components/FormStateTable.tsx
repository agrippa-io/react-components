import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

const sxAccordionBody = {
  backgroundColor: '#666666',
}

const boolToString = (value: boolean): string => {
  return value ? 'true' : 'false'
}

export interface FormStateTableProps {
  isDirty: boolean
  isSubmitted: boolean
  isSubmitSuccessful: boolean
  isSubmitting: boolean
  isLoading: boolean
  submitCount: number
  isValid: boolean
  isValidating: boolean
}

export const FormStateTable = ({
  isDirty,
  isSubmitted,
  isSubmitSuccessful,
  isSubmitting,
  isLoading,
  submitCount,
  isValid,
  isValidating,
}: FormStateTableProps) => {
  // console.log('FormStateTable', {
  //   isDirty,
  //   isSubmitted,
  //   isSubmitSuccessful,
  //   isSubmitting,
  //   isLoading,
  //   submitCount,
  //   isValid,
  //   isValidating,
  // })
  return (
    <Accordion sx={{ width: '100%' }} defaultExpanded={true}>
      <AccordionSummary>
        <Typography>Form State</Typography>
      </AccordionSummary>

      <AccordionDetails sx={sxAccordionBody}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Field</TableCell>
              <TableCell>State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>isLoading</TableCell>
              <TableCell>{ boolToString(isLoading) }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>isDirty</TableCell>
              <TableCell>{ boolToString(isDirty) }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>isValidating</TableCell>
              <TableCell>{ boolToString(isValidating) }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>isValid</TableCell>
              <TableCell>{ boolToString(isValid) }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>submitCount</TableCell>
              <TableCell>{ submitCount }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>isSubmitting</TableCell>
              <TableCell>{ boolToString(isSubmitting) }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>isSubmitted</TableCell>
              <TableCell>{ boolToString(isSubmitted) }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>isSubmitSuccessful</TableCell>
              <TableCell>{ boolToString(isSubmitSuccessful) }</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  )
}
