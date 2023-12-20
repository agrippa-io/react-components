import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { PlaceList, IPlaceListProps } from '../PlaceList.component';
import { PlaceListItemDetailed } from '../components/PlaceListItemDetailed';
declare const _default: ComponentMeta<typeof PlaceList>;
export default _default;
export declare const PlaceListDetailed: {
    (args: IPlaceListProps): React.JSX.Element;
    args: {
        places: import("../../../services").IPlace[];
        ListItemComponent: typeof PlaceListItemDetailed;
    };
};
