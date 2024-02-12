import { writable } from "svelte/store"

interface CellIndex {
  r: number
  c: number
}

interface HatchingArea {
  left: number
  top: number
  width: number
  height: number
  cellHeight: number
  cellWidth: number
  layout: "COLUMN" | "ROW" | "ALL"
}

export const useSpreadsheet = () => {
  const activeCell = writable<CellIndex>({ r: 0, c: 0 })
  const activeCellElement = writable<HTMLTableCellElement | null>(null)

  const activeColumn = writable<number>(0)
  const activeRow = writable<number>(0)

  const allSelected = writable<boolean>(false)

  const hatchingArea = writable<HatchingArea>(null)

  const selectCell = (row: number, column: number) => {
    activeCell.set({ r: row, c: column })

    // clear other selections
    hatchingArea.set(null)
    activeColumn.set(0)
    activeRow.set(0)
    allSelected.set(false)
  }

  const selectColumn = (column: number) => {
    activeColumn.set(column)

    // clear other selections
    activeCell.set({ r: 0, c: 0 })
    activeRow.set(0)
    allSelected.set(false)
  }

  const selectRow = (row: number) => {
    activeRow.set(row)

    // clear other selections
    activeCell.set({ r: 0, c: 0 })
    activeColumn.set(0)
    allSelected.set(false)
  }

  const selectAll = () => {
    allSelected.set(true)

    // clear other selections
    activeCell.set({ r: 0, c: 0 })
    activeColumn.set(0)
    activeRow.set(0)
  }

  const hatching = (table: HTMLTableElement) => {
    activeColumn.subscribe((activeColumn) => {
      if (activeColumn === 0) return
      const rows = [...table.rows]
      const startCell = rows[1].cells[activeColumn]
      const endCell = rows[rows.length - 1].cells[activeColumn]
      const { left, top, height: cellHeight, width: cellWidth } = startCell.getBoundingClientRect()
      const { right, bottom } = endCell.getBoundingClientRect()
      const width = right - left
      const height = bottom - top
      hatchingArea.set({ left, top, width, height, cellHeight, cellWidth, layout: "COLUMN" })
    })

    activeRow.subscribe((activeRow) => {
      if (activeRow === 0) return
      const row = table.rows[activeRow]
      const startCell = row.cells[1]
      const endCell = row.cells[row.cells.length - 1]
      const { left, top, height: cellHeight, width: cellWidth } = startCell.getBoundingClientRect()
      const { right, bottom } = endCell.getBoundingClientRect()
      const width = right - left
      const height = bottom - top
      hatchingArea.set({ left, top, width, height, cellHeight, cellWidth, layout: "ROW" })
    })

    allSelected.subscribe((allSelected) => {
      if (allSelected) {
        const startCell = table.rows[1].cells[1]
        const endCell = table.rows[table.rows.length - 1].cells[table.rows[0].cells.length - 1]
        const {
          left,
          top,
          height: cellHeight,
          width: cellWidth
        } = startCell.getBoundingClientRect()
        const { right, bottom } = endCell.getBoundingClientRect()
        const width = right - left
        const height = bottom - top
        hatchingArea.set({ left, top, width, height, cellHeight, cellWidth, layout: "ALL" })
      }
    })
  }

  const navigate = (table: HTMLTableElement) => {
    table.addEventListener("keydown", (e) => {
      if (e.key.startsWith("Arrow")) {
        e.preventDefault()
      }
      switch (e.key) {
        case "ArrowUp":
          activeCell.update((cell) => (cell.r > 1 ? { ...cell, r: cell.r - 1 } : cell))
          break
        case "ArrowDown":
          const maxRow = table.rows.length - 1
          activeCell.update((cell) => (cell.r < maxRow ? { ...cell, r: cell.r + 1 } : cell))
          break
        case "ArrowLeft":
          activeCell.update((cell) => (cell.c > 1 ? { ...cell, c: cell.c - 1 } : cell))
          break
        case "ArrowRight":
          const maxColumn = table.rows[0].cells.length - 1
          activeCell.update((cell) => (cell.c < maxColumn ? { ...cell, c: cell.c + 1 } : cell))
          break
      }
    })

    activeCell.subscribe(({ r, c }) => {
      const cell = table.rows[r].cells[c]
      activeCellElement.set(cell)

      const input$ = cell.querySelector("input")
      input$?.focus()
    })
  }

  return [
    { activeCell, activeCellElement, activeColumn, activeRow, allSelected, hatchingArea },
    { navigate, selectCell, selectColumn, selectRow, selectAll, hatching }
  ] as const
}
