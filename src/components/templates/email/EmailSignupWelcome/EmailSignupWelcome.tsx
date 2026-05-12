import React from 'react'
import {
  Mjml,
  MjmlAttributes,
  MjmlBody,
  MjmlButton,
  MjmlColumn,
  MjmlHead,
  MjmlImage,
  MjmlSection,
  MjmlSpacer,
  MjmlStyle,
  MjmlText,
  MjmlTitle,
  MjmlAll,
} from '@faire/mjml-react'

export interface EmailSignupWelcomeProps {
  subject: string
  confirmationUrl: string
  userName: string
}

export const EmailSignupWelcome = ({
  userName,
  subject,
  confirmationUrl,
}: EmailSignupWelcomeProps) => (
  <Mjml>
    <MjmlHead>
      <MjmlTitle>{subject}</MjmlTitle>
      <MjmlAttributes>
        <MjmlAll padding="0" />
        <MjmlText
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="14px"
          lineHeight="22px"
          color="#1A1A1A"
          align="center"
        />
      </MjmlAttributes>
      <MjmlStyle>{`
        body { background-color: #F5F8FA; }
        .card { box-shadow: 6px 6px 40px 3px rgba(140, 152, 164, 0.2); border-radius: 7px; }
      `}</MjmlStyle>
    </MjmlHead>
    <MjmlBody backgroundColor="#F5F8FA" width="600px">
      <MjmlSection padding="45px 0 0">
        <MjmlColumn>
          <MjmlImage
            src="https://s3.eu-central-1.amazonaws.com/images.ovrsea.com/Ovrsea-Logo-noir%2Bpicto.png"
            width="160px"
            height="40px"
            alt="Ovrsea Logo"
          />
        </MjmlColumn>
      </MjmlSection>
      <MjmlSection padding="30px 0 0">
        <MjmlColumn
          backgroundColor="#FFFFFF"
          cssClass="card"
          paddingLeft="32px"
          paddingRight="32px"
        >
          <MjmlSpacer height="40px" />
          <MjmlText fontSize="22px" fontWeight="bold">
            Welcome to OVRSEA
          </MjmlText>
          <MjmlSpacer height="25px" />
          <MjmlText>Hello {userName}, we are happy to have you on board!</MjmlText>
          <MjmlSpacer height="25px" />
          <MjmlText>
            To access the optimal experience for shipment management, you only need to activate your
            account below.
          </MjmlText>
          <MjmlSpacer height="50px" />
          <MjmlButton
            href={confirmationUrl}
            backgroundColor="rgb(59, 139, 128)"
            color="#FFFFFF"
            borderRadius="4px"
            fontSize="14px"
            height="48px"
            width="100%"
            innerPadding="13px 25px"
          >
            Activate my account
          </MjmlButton>
          <MjmlSpacer height="35px" />
        </MjmlColumn>
      </MjmlSection>
      <MjmlSection padding="35px 0 0" />
    </MjmlBody>
  </Mjml>
)
