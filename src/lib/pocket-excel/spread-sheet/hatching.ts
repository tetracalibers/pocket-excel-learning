import { type Writable } from "svelte/store"

interface State {
  activeColumn: Writable<number>
  activeRow: Writable<number>
  allSelected: Writable<boolean>
}

const CLASSNAMES = {
  borderAll: "hatching_border",
  borderLeft: "hatching_border-left",
  borderRight: "hatching_border-right",
  borderBottom: "hatching_border-bottom",
  borderTop: "hatching_border-top"
}

export const useHatching = (state: State) => {
  const { activeColumn, activeRow, allSelected } = state

  return (table: HTMLTableElement) => {
    const tbody = table.querySelector("tbody")

    allSelected.subscribe((all) => {
      const bottomBorderTargets = table.querySelectorAll(`[scope="col"]:not(:first-child)`)

      if (all) {
        bottomBorderTargets.forEach((el) => {
          el.classList.add(CLASSNAMES.borderBottom)
        })
      } else {
        bottomBorderTargets.forEach((el) => {
          el.classList.remove(CLASSNAMES.borderBottom)
        })
      }
    })
  }
}
