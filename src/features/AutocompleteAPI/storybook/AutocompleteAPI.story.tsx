import React from "react";

import { ComponentMeta } from "@storybook/react";

import { AutocompleteAPI, IAutocompleteAPIProps } from "../AutocompleteAPI.component";
import { AutocompleteAPIArgTypes } from "./AutocompleteAPI.argTypes";
import { options } from "./constants";

export default {
  title: "travel-react / Components / molecules / AutocompleteAPI",
  component: AutocompleteAPI,
  argTypes: AutocompleteAPIArgTypes,
} as ComponentMeta<typeof AutocompleteAPI>;

export const AutocompleteAPIOverview = (args: IAutocompleteAPIProps) => (
  <AutocompleteAPI {...args} options={options} />
);
