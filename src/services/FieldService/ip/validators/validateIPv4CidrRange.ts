import { Validator } from "ip-num";

export function validateIPv4CidrRange(value: string) {
  if (!value) {
    return true;
  }

  const [isValid, errors] = Validator.isValidIPv4CidrRange(value);

  if (errors.length) {
    return errors.shift();
  }

  return isValid;
}
