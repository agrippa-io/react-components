export interface IValidateMaxCharProps {
    max: number;
    message?: string;
}
export declare function validateMaxChar({ max, message }: IValidateMaxCharProps): (value: any) => string | true;
