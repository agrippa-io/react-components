import { minChar } from './minChar'
import { maxChar } from './maxChar'

export function rangeChar(str: string, min: number, max: number): boolean {
  return minChar(str, min) && maxChar(str, max)
}
