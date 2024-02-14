import { writable } from "svelte/store"
import { useHatching, type HatchingArea } from "./spread-sheet/hatching"

interface CellIndex {
  r: number
  c: number
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

  const hatching = useHatching({
    activeColumn,
    activeRow,
    allSelected,
    hatchingArea
  })

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
