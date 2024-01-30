import React from 'react'
export interface TableFieldRowProps {
  state: Record<any, any>
  emptyMessage: string
}
export declare const TableFieldRow: ({
  state,
  emptyMessage,
}: TableFieldRowProps) => React.JSX.Element
export interface TableFieldsProps {
  sx?: any
  name: string
  state: Record<any, any>
  emptyMessage?: string
}
export declare const TableFields: ({
  sx,
  name,
  state,
  emptyMessage,
}: TableFieldsProps) => React.JSX.Element
