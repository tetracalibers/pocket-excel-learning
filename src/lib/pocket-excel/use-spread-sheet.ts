import { writable } from "svelte/store"
import { toObservable } from "../with-rxjs"
import { fromEvent, map, combineLatest, debounceTime, merge, filter } from "rxjs"

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
    const rows = [...table.rows]

    const activeColumn$ = toObservable(activeColumn)
    const columnHatching$ = activeColumn$.pipe(filter((col) => col !== 0)).pipe(
      map((col) => ({
        startCell: rows[1].cells[col],
        endCell: rows[rows.length - 1].cells[col]
      }))
    )

    const activeRow$ = toObservable(activeRow)
    const rowHatching$ = activeRow$.pipe(filter((row) => row !== 0)).pipe(
      map((row) => ({
        startCell: rows[row].cells[1],
        endCell: rows[row].cells[rows[0].cells.length - 1]
      }))
    )

    const isSelectedAll$ = toObservable(allSelected)
    const allHatching$ = isSelectedAll$.pipe(filter((selected) => selected)).pipe(
      map(() => ({
        startCell: rows[1].cells[1],
        endCell: rows[rows.length - 1].cells[rows[0].cells.length - 1]
      }))
    )

    const scroll$ = fromEvent(table, "scroll").pipe(debounceTime(2))
    const trigger$ = merge(scroll$, activeColumn$, activeRow$, isSelectedAll$)
    const scrollX$ = trigger$.pipe(map(() => window.scrollX))
    const scrollY$ = trigger$.pipe(map(() => window.scrollY))

    combineLatest([columnHatching$, scrollX$]).subscribe(([{ startCell, endCell }, x]) => {
      const startCellRect = startCell.getBoundingClientRect()
      const endCellRect = endCell.getBoundingClientRect()

      const left = x + startCellRect.left
      const right = x + endCellRect.right
      const { top, height: cellHeight, width: cellWidth } = startCellRect
      const { bottom } = endCellRect
      const width = right - left
      const height = bottom - top

      hatchingArea.set({ left, top, width, height, cellHeight, cellWidth, layout: "COLUMN" })
    })

    combineLatest([rowHatching$, scrollY$]).subscribe(([{ startCell, endCell }, y]) => {
      const startCellRect = startCell.getBoundingClientRect()
      const endCellRect = endCell.getBoundingClientRect()

      const top = y + startCellRect.top
      const bottom = y + endCellRect.bottom
      const { left, height: cellHeight, width: cellWidth } = startCellRect
      const { right } = endCellRect
      const width = right - left
      const height = bottom - top

      hatchingArea.set({ left, top, width, height, cellHeight, cellWidth, layout: "ROW" })
    })

    combineLatest([allHatching$, scrollX$, scrollY$]).subscribe(
      ([{ startCell, endCell }, x, y]) => {
        const startCellRect = startCell.getBoundingClientRect()
        const endCellRect = endCell.getBoundingClientRect()

        const left = x + startCellRect.left
        const top = y + startCellRect.top
        const right = x + endCellRect.right
        const bottom = y + endCellRect.bottom
        const { height: cellHeight, width: cellWidth } = startCellRect
        const width = right - left
        const height = bottom - top

        hatchingArea.set({ left, top, width, height, cellHeight, cellWidth, layout: "ALL" })
      }
    )
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
