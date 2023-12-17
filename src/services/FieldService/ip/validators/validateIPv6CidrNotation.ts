import { Validator } from "ip-num";

export function validateIPv6CidrNotation(value: string) {
  if (!value) {
    return true;
  }

  const [isValid, errors] = Validator.isValidIPv6CidrNotation(value);

  if (errors.length) {
    return errors.shift();
  }

  return isValid;
}
