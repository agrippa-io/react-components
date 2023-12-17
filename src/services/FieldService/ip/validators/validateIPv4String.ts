import { Validator } from "ip-num";

export function validateIPv4String(value: string) {
  if (!value) {
    return true;
  }

  const [isValid, errors] = Validator.isValidIPv4String(value);

  if (errors.length) {
    return errors.shift();
  }

  return isValid;
}
