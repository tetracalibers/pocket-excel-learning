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
  const activeCellElement = writable<HTMLInputElement | null>(null)
  const activeCellDraftValue = writable<string>("")

  const activeColumn = writable<number>(0)
  const activeRow = writable<number>(0)

  const allSelected = writable<boolean>(false)

  const hatchingArea = writable<HatchingArea>(null)

  const editActiveCell = (value: string) => {
    activeCellDraftValue.set(value)
  }

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
      const left = window.scrollX + startCell.getBoundingClientRect().left
      const right = window.scrollX + endCell.getBoundingClientRect().right
      const { top, height: cellHeight, width: cellWidth } = startCell.getBoundingClientRect()
      const { bottom } = endCell.getBoundingClientRect()
      const width = right - left
      const height = bottom - top
      hatchingArea.set({ left, top, width, height, cellHeight, cellWidth, layout: "COLUMN" })
    })

    activeRow.subscribe((activeRow) => {
      if (activeRow === 0) return
      const row = table.rows[activeRow]
      const startCell = row.cells[1]
      const endCell = row.cells[row.cells.length - 1]
      const top = window.scrollY + startCell.getBoundingClientRect().top
      const bottom = window.scrollY + endCell.getBoundingClientRect().bottom
      const { left, height: cellHeight, width: cellWidth } = startCell.getBoundingClientRect()
      const { right } = endCell.getBoundingClientRect()
      const width = right - left
      const height = bottom - top
      hatchingArea.set({ left, top, width, height, cellHeight, cellWidth, layout: "ROW" })
    })

    allSelected.subscribe((allSelected) => {
      if (allSelected) {
        const startCell = table.rows[1].cells[1]
        const endCell = table.rows[table.rows.length - 1].cells[table.rows[0].cells.length - 1]
        const left = window.scrollX + startCell.getBoundingClientRect().left
        const top = window.scrollY + startCell.getBoundingClientRect().top
        const right = window.scrollX + endCell.getBoundingClientRect().right
        const bottom = window.scrollY + endCell.getBoundingClientRect().bottom
        const { height: cellHeight, width: cellWidth } = startCell.getBoundingClientRect()
        const width = right - left
        const height = bottom - top
        hatchingArea.set({ left, top, width, height, cellHeight, cellWidth, layout: "ALL" })
      }
    })
  }

  const navigate = (table: HTMLTableElement) => {
    table.addEventListener("keydown", (e) => {
      if (e.key.startsWith("Arrow") || e.key === "Enter") {
        e.preventDefault()
      }
      switch (e.key) {
        case "ArrowUp":
          activeCell.update((cell) => (cell.r > 1 ? { ...cell, r: cell.r - 1 } : cell))
          break
        case "ArrowDown":
        case "Enter":
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
      const cellBox = table.rows[r].cells[c]
      const cell = cellBox.querySelector("input")

      if (!cell) {
        activeCellElement.set(null)
        activeCellDraftValue.set("")
        return
      }

      activeCellElement.set(cell)
      activeCellDraftValue.set(cell.value)

      cell.focus()
    })
  }

  return [
    {
      activeCell,
      activeCellElement,
      activeColumn,
      activeRow,
      allSelected,
      hatchingArea,
      activeCellDraftValue
    },
    { navigate, selectCell, selectColumn, selectRow, selectAll, hatching, editActiveCell }
  ] as const
}
