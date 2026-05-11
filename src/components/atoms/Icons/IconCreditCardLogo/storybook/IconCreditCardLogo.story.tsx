import React from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box, Typography, Tooltip } from '@mui/material'
import { IconCreditCardLogo, IIconCreditCardLogoProps } from '../IconCreditCardLogo'
import { IconCreditCardStyleMap, IconCreditCardStyle, IconCreditCardCompany } from '../constants'

const meta: Meta<typeof IconCreditCardLogo> = {
  title: 'Components / atoms / Icon / IconCreditCardLogo',
  component: IconCreditCardLogo,
  // argTypes: IconCreditCardLogoArgTypes,
  args: {
    height: 322,
    width: 500,
    iconStyle: 'flat-rounded',
    company: 'amex',
  },
  // Opt out of the global `autodocs` (set in .storybook/preview.js): the
  // story's render is a showcase grid of every iconStyle × company
  // combination, so the auto-generated docs page would expose Controls that
  // only drive the small "active" icon at top while the static grid below
  // ignores them — confusing for anyone landing on the Docs tab. Use the
  // Canvas tab to see this story.
  tags: ['!autodocs'],
}
export default meta

function renderIconCreditCardLogoStyles() {
  return Object.keys(IconCreditCardStyleMap).map((iconStyle) => (
    <Box>
      <Typography variant="h5">{iconStyle}</Typography>
      {renderIconCreditCardLogoList(
        iconStyle,
        IconCreditCardStyleMap[iconStyle as IconCreditCardStyle],
      )}
    </Box>
  ))
}

function renderIconCreditCardLogoList(iconStyle: string, styleMap: Record<string, any>) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      {Object.keys(styleMap).map((company) => renderIconCreditCardLogo(iconStyle, company))}
    </Box>
  )
}

function renderIconCreditCardLogo(iconStyle: string, company: string) {
  return (
    <Tooltip title={renderTooltipTitle(iconStyle, company)}>
      <Box
        key={`${iconStyle}-${company}`}
        sx={{
          margin: '5px',
          padding: '5px',
          border: '1px solid #CCCCCC',
          borderRadius: '4px',
          width: '150px',
        }}
        width={150}
      >
        <IconCreditCardLogo
          iconStyle={iconStyle as IconCreditCardStyle}
          company={company as IconCreditCardCompany}
        />
      </Box>
    </Tooltip>
  )
}

function renderTooltipTitle(iconStyle: string, company: string) {
  return (
    <Box>
      <Typography variant="body1">
        iconStyle:
        <br />
        <strong>{iconStyle}</strong>
      </Typography>
      <br />
      <Typography variant="body1">
        company:
        <br />
        <strong>{company}</strong>
      </Typography>
    </Box>
  )
}

export const FieldAutocompleteOverview: StoryObj<typeof IconCreditCardLogo> = {
  render: (args: IIconCreditCardLogoProps) => (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          backgroundColor: '#CCCCCC',
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <Tooltip title={renderTooltipTitle(args.iconStyle, args.company)}>
          <IconCreditCardLogo {...args} />
        </Tooltip>
      </Box>
      <Box sx={{ overflowX: 'scroll' }}>{renderIconCreditCardLogoStyles()}</Box>
    </Box>
  ),
}
