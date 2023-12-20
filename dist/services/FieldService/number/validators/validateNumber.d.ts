export interface IValidateNumberProps {
    message?: string;
}
export declare function validateNumber({ message }: IValidateNumberProps): (value: any) => string | true;
