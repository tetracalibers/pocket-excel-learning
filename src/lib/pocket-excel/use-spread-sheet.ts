import { writable } from "svelte/store"
import { toObservable } from "../with-rxjs"
import { fromEvent, map, combineLatest, debounceTime, merge } from "rxjs"

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
  overflow: {
    top: boolean
    bottom: boolean
    left: boolean
    right: boolean
  }
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
    const rows = [...table.rows]

    const tableRect = table.getBoundingClientRect()
    const absLeftTopCellRect = rows[1].cells[1].getBoundingClientRect()

    const cellHeight = absLeftTopCellRect.height
    const cellWidth = absLeftTopCellRect.width

    const activeColumn$ = toObservable(activeColumn)
    const activeRow$ = toObservable(activeRow)
    const isSelectedAll$ = toObservable(allSelected)

    const scroll$ = fromEvent(table, "scroll").pipe(debounceTime(2))
    const trigger$ = merge(scroll$, activeColumn$, activeRow$, isSelectedAll$)
    const scrollX$ = trigger$.pipe(map(() => window.scrollX))
    const scrollY$ = trigger$.pipe(map(() => window.scrollY))

    combineLatest([activeColumn$, scrollX$]).subscribe(([col, x]) => {
      if (col === 0) return

      const startCellRect = rows[1].cells[col].getBoundingClientRect()
      const endCellRect = rows[rows.length - 1].cells[col].getBoundingClientRect()

      const left = Math.max(x + startCellRect.left, absLeftTopCellRect.left)
      const right = Math.min(x + endCellRect.right, tableRect.right)
      const bottom = Math.min(tableRect.bottom, endCellRect.bottom)
      const top = tableRect.top + cellHeight
      const width = right - left
      const height = bottom - top

      const overflow = {
        top: startCellRect.top < top,
        bottom: endCellRect.bottom > tableRect.bottom,
        left: x + startCellRect.left <= absLeftTopCellRect.left,
        right: width < 0
      }

      hatchingArea.set({
        left,
        top,
        width,
        height,
        cellHeight,
        cellWidth,
        layout: "COLUMN",
        overflow
      })
    })

    combineLatest([activeRow$, scrollY$]).subscribe(([row, y]) => {
      if (row === 0) return

      const startCellRect = rows[row].cells[1].getBoundingClientRect()
      const endCellRect = rows[row].cells[rows[0].cells.length - 1].getBoundingClientRect()

      const top = Math.max(y + startCellRect.top, tableRect.top)
      const bottom = Math.min(y + endCellRect.bottom, tableRect.bottom)
      const left = absLeftTopCellRect.left
      const width = tableRect.width + (tableRect.left - absLeftTopCellRect.left)
      const height = bottom - top

      const overflow = {
        top: top < startCellRect.top || top === absLeftTopCellRect.top,
        bottom: endCellRect.bottom > tableRect.bottom,
        left: startCellRect.left < left,
        right: Math.round(endCellRect.right) !== tableRect.right
      }

      hatchingArea.set({ left, top, width, height, cellHeight, cellWidth, layout: "ROW", overflow })
    })

    combineLatest([isSelectedAll$, scrollY$]).subscribe(([selected]) => {
      if (!selected) return

      const startCellRect = rows[1].cells[1].getBoundingClientRect()
      const endCellRect =
        rows[rows.length - 1].cells[rows[0].cells.length - 1].getBoundingClientRect()

      const left = absLeftTopCellRect.left
      const top = tableRect.top + cellHeight
      const right = tableRect.right
      const bottom = Math.min(tableRect.bottom, endCellRect.bottom)
      const width = right - left
      const height = bottom - top

      const overflow = {
        top: startCellRect.top < tableRect.top,
        bottom: endCellRect.bottom > tableRect.bottom,
        left: startCellRect.left < left,
        right: Math.round(endCellRect.right) !== tableRect.right
      }

      hatchingArea.set({ left, top, width, height, cellHeight, cellWidth, layout: "ALL", overflow })
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
