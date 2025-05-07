export interface IValidateFloatProps {
    message?: string;
}
export declare function validateFloat({ message }: IValidateFloatProps): (value: any) => string | true;
