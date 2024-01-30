import React from 'react'
import { Control } from 'react-hook-form'
export interface ReactHookFormStatePaneProps {
  sx?: any
  control?: Control
  name?: string
  disabled?: boolean
  exact?: boolean
}
export declare const ReactHookFormStatePane: ({
  sx,
  control,
  name,
  disabled,
  exact,
}: ReactHookFormStatePaneProps) => React.JSX.Element
