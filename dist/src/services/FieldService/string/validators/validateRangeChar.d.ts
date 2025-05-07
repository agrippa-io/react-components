export interface IValidateRangeCharProps {
    min?: number;
    max: number;
    message?: string;
}
export declare function validateRangeChar({ min, max, message }: IValidateRangeCharProps): (value: any) => string | true;
