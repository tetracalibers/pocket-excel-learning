export interface CellAddress {
  /** Column number */
  c: number
  /** Row number */
  r: number
}

const decodeColumnAlpha = (c: string) => c.charCodeAt(0) - 65
const decodeRowNumber = (r: string) => +r - 1
export const decodeCell = (address: string): CellAddress => {
  const c = address.match(/[A-Z]+/)[0]
  const r = address.match(/\d+/)[0]
  return { c: decodeColumnAlpha(c), r: decodeRowNumber(r) }
}

export const encode = (cell: CellAddress) => `${String.fromCharCode(65 + cell.c)}${cell.r + 1}`
export const decode = (address: [string, string]): CellAddress[] => {
  const [c1, c2] = address
  return [decodeCell(c1), decodeCell(c2)]
}

const getBorder = (selection: CellAddress[]): { tl: CellAddress; br: CellAddress } => {
  // bottomRight
  const br = {
    c: selection[0].c > selection[1].c ? selection[0].c : selection[1].c,
    r: selection[0].r > selection[1].r ? selection[0].r : selection[1].r
  }
  // topLeft
  const tl = {
    c: selection[0].c < selection[1].c ? selection[0].c : selection[1].c,
    r: selection[0].r < selection[1].r ? selection[0].r : selection[1].r
  }
  return { tl, br }
}

export const mergeSelectExtends = (
  data: any[][],
  selected: [string, string],
  extended: [string, string]
) => {
  // merge logic here...
  const sel = getBorder(decode(selected))
  const ext = getBorder(decode(extended))
  // if extended is inside selected
  if (
    ext.tl.c >= sel.tl.c &&
    ext.br.c <= sel.br.c &&
    ext.tl.r >= sel.tl.r &&
    ext.br.r <= sel.br.r
  ) {
    // every cells outside ext and inside sel are emptied
    for (var c = sel.tl.c; c <= sel.br.c; c++) {
      for (var r = sel.tl.r; r <= sel.br.r; r++) {
        // if the cell is outside extended and inside selected erase it
        if (c > ext.br.c || r > ext.br.r) {
          data[r][c] = ""
        }
      }
    }
  } else {
    // extended extend the selection
    // for all cells outside selection
    for (var c = ext.tl.c; c <= ext.br.c; c++) {
      for (var r = ext.tl.r; r <= ext.br.r; r++) {
        const brsel = { c: sel.br.c + 1, r: sel.br.r + 1 }
        const selwidth = brsel.c - sel.tl.c
        const selheight = brsel.r - sel.tl.r
        if (c < sel.tl.c) {
          // cell is on the left
          data[r][c] = data[r][sel.br.c - (Math.abs(c - sel.tl.c + 1) % selwidth)]
        }
        if (c > sel.br.c) {
          // cell is on the right
          data[r][c] = data[r][sel.tl.c + ((c - sel.br.c - 1) % selwidth)]
        }
        // if extended to unknown rows territory
        if (data.length - 1 < r) {
          data = [...data, Array.from({ length: r - data.length + 1 })]
        }
        if (r < sel.tl.r) {
          // cell is on top
          data[r][c] = data[sel.br.r - (Math.abs(r - sel.tl.r + 1) % selheight)][c]
        }
        if (r > sel.br.r) {
          // cell is below
          data[r][c] = data[sel.tl.r + ((r - sel.br.r - 1) % selheight)][c]
        }
      }
    }
  }
  return data
}
