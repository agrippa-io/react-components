import React, { MouseEvent } from "react";

import { IPlaceListItemProps } from "../@types";
import { ListItemButton, ListItemText } from "@mui/material";

export interface IPlaceListItemSimple extends IPlaceListItemProps {}

export function PlaceListItemSimple({ place, onClick = () => {} }: IPlaceListItemSimple) {
  console.log("PlaceListItemDetailed(props)", { place });

  const forwardEventWithTargetValue = (e: MouseEvent) => {
    onClick({
      ...e,
      target: {
        ...e.target,
        value: place,
      },
    } as MouseEvent);
  };

  return (
    <ListItemButton onClick={forwardEventWithTargetValue}>
      <ListItemText>{place?.businessName ?? "No Name"}</ListItemText>
    </ListItemButton>
  );
}
