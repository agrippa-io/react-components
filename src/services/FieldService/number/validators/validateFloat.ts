import { isFloat } from "../utils";

export interface IValidateFloatProps {
  message?: string;
}

export function validateFloat({ message = "Must be an float" }: IValidateFloatProps) {
  return (value: any) => {
    if (isFloat(value) || value === "") {
      return true;
    }

    return message;
  };
}
