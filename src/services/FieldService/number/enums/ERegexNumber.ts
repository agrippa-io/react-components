export type ERegexNumberKey = "INTEGER" | "FLOAT";

export const ERegexNumber: Record<ERegexNumberKey, RegExp> = {
  INTEGER: /^[0-9]+$/,
  FLOAT: /^[0-9]+\.[0-9]+/,
};
