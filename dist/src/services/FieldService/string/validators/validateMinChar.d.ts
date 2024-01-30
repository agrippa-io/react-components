export interface IValidateMinCharProps {
  min: number
  message?: string
}
export declare function validateMinChar({
  min,
  message,
}: IValidateMinCharProps): (value: any) => string | true
