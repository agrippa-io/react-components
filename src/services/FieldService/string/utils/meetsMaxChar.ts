export function meetsMaxChar(str: string, max: number): boolean {
  return !!str && str.length <= max
}
