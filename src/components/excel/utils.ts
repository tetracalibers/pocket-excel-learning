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

export const spillY = (start: CellAddress, end: CellAddress) => {
  if (start.col === end.col) {
    return Array.from({ length: end.row - start.row + 1 }, (_, i) => ({
      row: start.row + i + 1,
      col: start.col
    }))
  }
  return []
}

export const spillX = (start: CellAddress, end: CellAddress) => {
  if (start.row === end.row) {
    return Array.from({ length: end.col - start.col + 1 }, (_, i) => ({
      row: start.row + 1,
      col: start.col + i
    }))
  }
  return []
}

const CELL_RANGE_REGEX = /([A-Z]+)(\d+):([A-Z]+)(\d+)/

export const parseSpillFormula = (formula: string) => {
  const match = formula.match(CELL_RANGE_REGEX)

  return (row: number, col: number): string => {
    if (match) {
      const [addr, startCol, startRow, endCol, endRow] = match

      const start = decodeCell(startCol + startRow)
      const end = decodeCell(endCol + endRow)

      if (start.col === end.col) {
        return formula.replace(addr, encodeColumn(start.col) + (row + 1))
      }

      if (start.row === end.row) {
        return formula.replace(addr, encodeColumn(col) + (start.row + 1))
      }

      return formula
    }

    return formula
  }
}
