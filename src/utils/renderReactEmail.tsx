import React, { ComponentType } from 'react'

import { render } from '@faire/mjml-react/utils/render'

export const renderReactEmail = (Component: ComponentType<any>, data: any): string => {
  const { html } = render(<Component {...data} />)
  return html
}
