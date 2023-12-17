import { Validator } from "ip-num";

export function validateIPv6Number(value: string) {
  if (!value) {
    return true;
  }

  const [isValid, errors] = Validator.isValidIPv6Number(BigInt(value));

  if (errors.length) {
    return errors.shift();
  }

  return isValid;
}
