export interface IValidateIntegerProps {
    message?: string;
}
export declare function validateInteger({ message }: {
    message?: string | undefined;
}): (value: any) => string | true;
