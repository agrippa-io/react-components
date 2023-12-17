import isEmpty from "lodash";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export interface TableFieldRowProps {
  state: Record<any, any>;
  emptyMessage: string;
}

export const TableFieldRow = ({ state, emptyMessage }: TableFieldRowProps) => {
  if (isEmpty(state)) {
    return (
      <TableRow>
        <TableCell colSpan={2}>{emptyMessage}</TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {Object.entries(state).map(([fieldName, fieldState]) => (
        <TableRow key={fieldName}>
          <TableCell>{fieldName}</TableCell>
          <TableCell>
            <Table>{renderStateObjectAsTable(fieldState)}</Table>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export interface TableFieldsProps {
  sx?: any;
  name: string;
  state: Record<any, any>;
  emptyMessage?: string;
}

export const TableFields = ({ sx, name, state, emptyMessage = "No Data" }: TableFieldsProps) => {
  return (
    <Table sx={sx}>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>{name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Field Name</TableCell>
          <TableCell>Field State</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableFieldRow state={state} emptyMessage={emptyMessage} />
      </TableBody>
    </Table>
  );
};

const renderStateObjectAsTable = (state: Record<any, any>) =>
  Object.entries(state).reduce((listItems, [key, value]) => {
    if (key !== "ref") {
      listItems.push(
        <TableRow>
          <TableCell>{key}</TableCell>
          <TableCell>{value as string}</TableCell>
        </TableRow>,
      );
    }

    return listItems;
  }, [] as any[]);
