import { meetsMinChar } from './meetsMinChar'
import { meetsMaxChar } from './meetsMaxChar'

export function isWithinRangeChar(str: string, min: number, max: number): boolean {
  return meetsMinChar(str, min) && meetsMaxChar(str, max)
}
