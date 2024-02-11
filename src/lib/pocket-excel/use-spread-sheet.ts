import { writable } from "svelte/store"

export const useSpreadsheet = () => {
  const activeCell = writable<{ r: number; c: number }>({ r: 0, c: 0 })
  const activeCellElement = writable<HTMLTableCellElement | null>(null)

  const selectCell = (row: number, column: number) => {
    activeCell.set({ r: row, c: column })
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
    { activeCell, activeCellElement },
    { navigate, selectCell }
  ] as const
}
