import React from "react";

import { ComponentMeta } from "@storybook/react";

import { IMapGoogleProps } from "../@types";
import { MapGoogle } from "../MapGoogle.component";
import { MapGoogleArgTypes } from "./MapGoogle.argTypes";

export default {
  title: "travel-react / Components / molecules / MapGoogle",
  component: MapGoogle,
  argTypes: MapGoogleArgTypes,
} as ComponentMeta<typeof MapGoogle>;

export const MapGoogleOverview = (args: IMapGoogleProps) => <MapGoogle {...args} />;
