import { Validator } from "ip-num";

export function validateIPv4Number(value: string) {
  if (!value) {
    return true;
  }

  const [isValid, errors] = Validator.isValidIPv4Number(BigInt(value));

  if (errors.length) {
    return errors.shift();
  }

  return isValid;
}
