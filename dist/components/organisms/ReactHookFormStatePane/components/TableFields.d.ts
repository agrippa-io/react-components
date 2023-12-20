export interface TableFieldRowProps {
    state: Record<any, any>;
    emptyMessage: string;
}
export declare const TableFieldRow: ({ state, emptyMessage }: TableFieldRowProps) => import("react").JSX.Element;
export interface TableFieldsProps {
    sx?: any;
    name: string;
    state: Record<any, any>;
    emptyMessage?: string;
}
export declare const TableFields: ({ sx, name, state, emptyMessage }: TableFieldsProps) => import("react").JSX.Element;
