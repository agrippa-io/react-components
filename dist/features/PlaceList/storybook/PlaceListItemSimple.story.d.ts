import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { PlaceList, IPlaceListProps } from '../PlaceList.component';
declare const _default: ComponentMeta<typeof PlaceList>;
export default _default;
export declare const PlaceListSimple: {
    (args: IPlaceListProps): React.JSX.Element;
    args: {
        places: import("../../../services").IPlace[];
    };
};
