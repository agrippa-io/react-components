import { Validator } from "ip-num";

export function validateIPv4CidrNotation(value: string) {
  if (!value) {
    return true;
  }

  const [isValid, errors] = Validator.isValidIPv4CidrNotation(value);

  if (errors.length) {
    return errors.shift();
  }

  return isValid;
}
