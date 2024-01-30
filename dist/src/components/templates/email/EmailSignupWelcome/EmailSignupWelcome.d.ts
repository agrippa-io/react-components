import React from 'react'
export interface EmailSignupWelcomeProps {
  subject: string
  confirmationUrl: string
  userName: string
}
export declare const EmailSignupWelcome: ({
  userName,
  subject,
  confirmationUrl,
}: EmailSignupWelcomeProps) => React.JSX.Element
