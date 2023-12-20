export interface FormStateTableProps {
    isDirty: boolean;
    isSubmitted: boolean;
    isSubmitSuccessful: boolean;
    isSubmitting: boolean;
    isLoading: boolean;
    submitCount: number;
    isValid: boolean;
    isValidating: boolean;
}
export declare const FormStateTable: ({ isDirty, isSubmitted, isSubmitSuccessful, isSubmitting, isLoading, submitCount, isValid, isValidating, }: FormStateTableProps) => import("react").JSX.Element;
