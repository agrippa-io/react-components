import { Validator } from "ip-num";

export function validateIPv6String(value: string) {
  if (!value) {
    return true;
  }

  const [isValid, errors] = Validator.isValidIPv6String(value);

  if (errors.length) {
    return errors.shift();
  }

  return isValid;
}
