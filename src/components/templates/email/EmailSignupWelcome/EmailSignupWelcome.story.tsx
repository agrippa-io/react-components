import { ComponentStory, ComponentMeta } from '@storybook/react'

import { EmailSignupWelcome, EmailSignupWelcomeProps } from './EmailSignupWelcome'

export default {
  title: 'Components / templates / email / EmailSignupWelcome',
  component: EmailSignupWelcome,
  args: {
    subject: 'Welcome to Agrippa, build your empire',
    confirmationUrl: '/auth/verify/email',
    userName: 'Vienna',
  },
} as ComponentMeta<typeof EmailSignupWelcome>

export const EmailSignupWelcomeComponent: ComponentStory<typeof EmailSignupWelcome> = (
  args: EmailSignupWelcomeProps,
) => <EmailSignupWelcome {...args} />
