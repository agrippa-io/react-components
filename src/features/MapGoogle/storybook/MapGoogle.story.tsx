import React from 'react';

import { ComponentMeta } from '@storybook/react';

import { MapGoogle } from '../MapGoogle.component';
import { MapGoogleArgTypes } from './MapGoogle.argTypes';

export default {
  title: 'travel-react / Components / molecules / MapGoogle',
  component: MapGoogle,
  argTypes: MapGoogleArgTypes,
} as ComponentMeta<typeof MapGoogle>;

// @ts-ignore
export const MapGoogleOverview = ({ data, ...args }) => <MapGoogle config={args.config} debug={args.debug} />;
