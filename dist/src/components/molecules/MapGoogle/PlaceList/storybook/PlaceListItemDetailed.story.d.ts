import React from 'react';
import { IPlaceListProps } from '../PlaceList';
import { PlaceListItemDetailed } from '../components/PlaceListItemDetailed';
declare const _default: import("@storybook/types").ComponentAnnotations<import("@storybook/react/dist/types-0fc72a6d").R, IPlaceListProps>;
export default _default;
export declare const PlaceListDetailed: {
    (args: IPlaceListProps): React.JSX.Element;
    args: {
        places: import("../../../../../services").IPlace[];
        ListItemComponent: typeof PlaceListItemDetailed;
    };
};
