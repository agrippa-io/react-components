import { isInteger } from "./isInteger";
import { isFloat } from "./isFloat";

export function isNumber(value: any) {
  return isInteger(value) || isFloat(value);
}
