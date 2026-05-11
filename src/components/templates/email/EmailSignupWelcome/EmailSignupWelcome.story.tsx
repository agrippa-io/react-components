import React from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { EmailSignupWelcome, EmailSignupWelcomeProps } from './EmailSignupWelcome'

const meta: Meta<typeof EmailSignupWelcome> = {
  title: 'Components / templates / email / EmailSignupWelcome',
  component: EmailSignupWelcome,
  args: {
    subject: 'Welcome to Agrippa, build your empire',
    confirmationUrl: '/auth/verify/email',
    userName: 'Vienna',
  },
}
export default meta

export const EmailSignupWelcomeComponent: StoryObj<typeof EmailSignupWelcome> = {
  render: (args: EmailSignupWelcomeProps) => <EmailSignupWelcome {...args} />,
}
