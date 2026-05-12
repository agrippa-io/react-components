import React, { useEffect, useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'
import { renderToMjml } from '@faire/mjml-react/utils/renderToMjml'
import mjml2html from 'mjml-browser'

import { EmailSignupWelcome, EmailSignupWelcomeProps } from './EmailSignupWelcome'

// Two MJML quirks the story has to navigate:
// 1. @faire/mjml-react's `render` util transitively imports html-minifier →
//    clean-css, which references Node globals (process, os.EOL) and explodes
//    in the browser. We compose the two steps manually: renderToMjml (React →
//    MJML string) + mjml-browser (MJML → HTML).
// 2. mjml-browser's compile function is async (returns a Promise), unlike the
//    Node `mjml` package. We resolve it in a useEffect and stash the HTML in
//    state so the iframe's srcDoc updates once compilation finishes.
const EmailPreview = (args: EmailSignupWelcomeProps) => {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    const mjmlString = renderToMjml(<EmailSignupWelcome {...args} />)
    Promise.resolve(mjml2html(mjmlString)).then((result) => {
      if (!cancelled) setHtml(result?.html ?? '')
    })
    return () => {
      cancelled = true
    }
  }, [args])

  return (
    <iframe
      title="EmailSignupWelcome preview"
      srcDoc={html}
      style={{ width: '100%', minHeight: 720, border: '1px solid #E5E7EB' }}
    />
  )
}

const meta: Meta<typeof EmailPreview> = {
  title: 'Components / templates / email / EmailSignupWelcome',
  component: EmailPreview,
  args: {
    subject: 'Welcome to Agrippa, build your empire',
    confirmationUrl: '/auth/verify/email',
    userName: 'Vienna',
  },
}
export default meta

export const EmailSignupWelcomeComponent: StoryObj<typeof EmailPreview> = {
  render: (args) => <EmailPreview {...args} />,
}
