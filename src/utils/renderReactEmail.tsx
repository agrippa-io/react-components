import React, { ComponentType } from 'react'

import { renderEmail } from 'react-html-email'

export const renderReactEmail = (Component: ComponentType<any>, data: any) => {
  return renderEmail(<Component {...data} />)
}
