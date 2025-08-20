import { REGEX_CVC } from '../constants'

export interface IsCvc {
  cvc: string
}
export function isCvc({ cvc }: IsCvc): boolean {
  return REGEX_CVC.test(cvc)
}
