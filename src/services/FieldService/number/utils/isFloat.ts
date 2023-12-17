import { ERegexNumber } from "../enums";

export function isFloat(str: string): boolean {
  return ERegexNumber.FLOAT.test(str);
}
