export interface CellAddress {
  col: number
  row: number
}

const A_CHARCODE = 65

export const encodeColumn = (col: number): string => String.fromCharCode(col + A_CHARCODE)

export const decodeColumnAlpha = (c: string) => c.charCodeAt(0) - A_CHARCODE
const decodeRowNumber = (r: string) => +r - 1

export const decodeCell = (address: string): CellAddress => {
  const c = address.match(/[A-Z]+/)[0]
  const r = address.match(/\d+/)[0]
  return { col: decodeColumnAlpha(c), row: decodeRowNumber(r) }
}
