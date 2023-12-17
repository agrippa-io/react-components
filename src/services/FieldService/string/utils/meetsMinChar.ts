export function meetsMinChar(str: string, min: number): boolean {
  return !!str && str.length >= min
}
