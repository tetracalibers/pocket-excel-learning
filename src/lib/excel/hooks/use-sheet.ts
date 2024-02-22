import { fromEvent, BehaviorSubject, combineLatest } from "rxjs"
import { decodeCell, encode, type CellAddress } from "../utils/cell"
import { mergeSelectExtends } from "@/lib/excel/utils/cell"
import { writable } from "svelte/store"

export interface TopStyle {
  width: number
  left: number
  top: number
}
export interface RightStyle {
  height: number
  top: number
  left: number
}
export interface BottomStyle {
  width: number
  left: number
  top: number
}
export interface LeftStyle {
  height: number
  top: number
  left: number
}

export interface ColLineStyle {
  width: number
  left: number
  top: number
}
export interface RowLineStyle {
  height: number
  top: number
  left: number
}

export interface SquareStyle {
  left: number
  top: number
}

interface Size {
  width: number
  height: number
}

export const useSpreadSheet = (data: unknown[][]) => {
  const data$ = new BehaviorSubject<unknown[][]>(data)

  const extension$ = new BehaviorSubject<boolean>(false)
  const selection$ = new BehaviorSubject<boolean>(false)
  const edition$ = new BehaviorSubject<boolean>(null)

  const selected$ = new BehaviorSubject<[string, string]>(null)
  const extended$ = new BehaviorSubject<[string, string]>(null)

  const topLeft$ = new BehaviorSubject<CellAddress>(null)
  const bottomRight$ = new BehaviorSubject<CellAddress>(null)

  const topExtendStyle = writable<TopStyle>({ width: 0, left: 0, top: 0 })
  const rightExtendStyle = writable<RightStyle>({ height: 0, top: 0, left: 0 })
  const bottomExtendStyle = writable<BottomStyle>({ width: 0, left: 0, top: 0 })
  const leftExtendStyle = writable<LeftStyle>({ height: 0, top: 0, left: 0 })

  const topSelectStyle = writable<TopStyle>({ width: 0, left: 0, top: 0 })
  const rightSelectStyle = writable<RightStyle>({ height: 0, top: 0, left: 0 })
  const bottomSelectStyle = writable<BottomStyle>({ width: 0, left: 0, top: 0 })
  const leftSelectStyle = writable<LeftStyle>({ height: 0, top: 0, left: 0 })

  const colLineStyle = writable<ColLineStyle>({ width: 0, left: 0, top: 0 })
  const rowLineStyle = writable<RowLineStyle>({ height: 0, top: 0, left: 0 })

  const squareStyle = writable<SquareStyle>({ left: 0, top: 0 })

  const selectSize = writable<Size>({ width: 0, height: 0 })

  //const square$ = new BehaviorSubject<{ x: number; y: number }>(null)

  const decoded$ = new BehaviorSubject<[CellAddress, CellAddress]>([
    { c: 0, r: 0 },
    { c: 0, r: 0 }
  ])

  selected$.subscribe((selected) => {
    decoded$.next(
      selected
        ? [decodeCell(selected[0]), decodeCell(selected[1])]
        : [
            { c: 0, r: 0 },
            { c: 0, r: 0 }
          ]
    )
  })

  const computeCellExtendStyle = (table: HTMLTableElement) => {
    const leftTopCell = table.rows[0].cells[0]
    const tableTop = table.offsetTop + leftTopCell.offsetHeight
    const tableLeft = table.offsetLeft + leftTopCell.offsetWidth

    const getRowHeight = (i: number) => {
      const row = table.rows[i + 1]
      return row ? row.offsetHeight : 0
    }

    const getColWidth = (i: number) => {
      const cell = table.rows[1].cells[i + 1]
      return cell ? cell.offsetWidth : 0
    }

    const computeBase = (tl: CellAddress, br: CellAddress) => {
      const topLeft = {
        c: br.c < tl.c ? br.c : tl.c,
        r: br.r < tl.r ? br.r : tl.r
      }
      const bottomRight = {
        c: br.c > tl.c ? br.c + 1 : tl.c + 1,
        r: br.r > tl.r ? br.r + 1 : tl.r + 1
      }

      const top = Array.from({ length: topLeft.r }, (_, i) => i).reduce(
        (acc, i) => acc + getRowHeight(i),
        tableTop
      )
      const left = Array.from({ length: topLeft.c }, (_, i) => i).reduce(
        (acc, i) => acc + getColWidth(i),
        tableLeft
      )
      const bottom = Array.from({ length: bottomRight.r }, (_, i) => i).reduce(
        (acc, i) => acc + getRowHeight(i),
        tableTop
      )
      const right = Array.from({ length: bottomRight.c }, (_, i) => i).reduce(
        (acc, i) => acc + getColWidth(i),
        tableLeft
      )

      return {
        topLeft,
        bottomRight,
        top,
        left,
        bottom,
        right,
        width: right - left,
        height: bottom - top
      }
    }

    combineLatest([selected$]).subscribe(([selected]) => {
      let tl = (selected && decodeCell(selected[0])) || { c: 0, r: 0 }
      let br = (selected && decodeCell(selected[1])) || { c: 0, r: 0 }

      const { topLeft, bottomRight, top, left, bottom, right, width, height } = computeBase(tl, br)

      topLeft$.next(topLeft)
      bottomRight$.next(bottomRight)

      topSelectStyle.set({ width, left, top })
      rightSelectStyle.set({ height, top, left: right })
      bottomSelectStyle.set({ width, left, top: bottom })
      leftSelectStyle.set({ height, top, left })

      colLineStyle.set({ width, left, top: tableTop })
      rowLineStyle.set({ height, top, left: tableLeft })

      squareStyle.set({ left: right, top: bottom })

      selectSize.set({ width, height })
    })

    combineLatest([extension$, extended$, selected$]).subscribe(
      ([extension, extended, selected]) => {
        if (!extension || !extended) return

        const tl = (selected && decodeCell(extended[0])) || { c: 0, r: 0 }
        const br = (selected && decodeCell(extended[1])) || { c: 0, r: 0 }

        const { topLeft, bottomRight, top, left, bottom, right, width, height } = computeBase(
          tl,
          br
        )

        topLeft$.next(topLeft)
        bottomRight$.next(bottomRight)

        topExtendStyle.set({ width, left, top })
        rightExtendStyle.set({ height, top, left: right })
        bottomExtendStyle.set({ width, left, top: bottom })
        leftExtendStyle.set({ height, top, left })
      }
    )
  }

  const watchCellSelection = (root: HTMLElement) => {
    const mousedown$ = fromEvent<MouseEvent>(root, "mousedown")
    const mouseup$ = fromEvent<MouseEvent>(root, "mouseup")
    //const mouseover$ = fromEvent<MouseEvent>(root, "mouseover")

    mousedown$.subscribe((e) => {
      // 右クリックは無視
      if (e.button === 3) return

      const target = <HTMLElement>e.target

      if (target.id === "square") {
        extension$.next(true)
        selection$.next(false)
        return
      }

      const x = target.dataset.x
      const y = target.dataset.y

      if (!x || !y) return

      const cell = encode({ c: +y, r: +x })
      const selected = selected$.getValue()

      if (e.shiftKey && selected && selected[0]) {
        edition$.next(null)
        selected$.next([selected[0], cell])
        return
      }

      edition$.next(null)
      selection$.next(true)
      selected$.next([cell, cell])
    })

    mouseup$.subscribe(() => {
      const selected = selected$.getValue()
      const extended = extended$.getValue()
      const selection = selection$.getValue()
      const extension = extension$.getValue()
      const edition = edition$.getValue()

      if (!!selected && !selection && extension) {
        const data = data$.getValue()

        extension$.next(false)
        data$.next(mergeSelectExtends(data, selected, extended))
        selected$.next(extended)
        return
      }

      if (!!edition || !selected || !selection) return

      selection$.next(false)
      extended$.next(selected)
    })

    // mouseover$.subscribe((e) => {
    //   const edition = edition$.getValue()
    //   if (!!edition) return

    //   const selected = selected$.getValue()
    //   const selection = selection$.getValue()
    //   const extension = extension$.getValue()

    //   const target = <HTMLElement>e.target

    //   const _x = target.dataset.x
    //   const _y = target.dataset.y

    //   if (!_x || !_y) return

    //   const x = +_x
    //   const y = +_y

    //   const topLeft = topLeft$.getValue()
    //   const bottomRight = bottomRight$.getValue()

    //   if (!!selected && !selection && extension) {
    //     if (x >= topLeft.c && x < bottomRight.c && y >= topLeft.r && y < bottomRight.r) {
    //       extended$.next([encode(topLeft), encode({ r: y, c: x })])
    //       return
    //     }

    //     const square = square$.getValue()
    //     const decoded = decoded$.getValue()

    //     if (y >= topLeft.r && y < bottomRight.r) {
    //       extended$.next([
    //         square.x < 0 ? encode({ c: bottomRight.c - 1, r: topLeft.r }) : selected[0],
    //         encode({ r: decoded[1].r, c: x })
    //       ])
    //     }
    //     if (x >= topLeft.c && x < bottomRight.c) {
    //       extended$.next([
    //         square.y < 0 ? encode({ r: bottomRight.r - 1, c: topLeft.c }) : selected[0],
    //         encode({ r: y, c: decoded[1].c })
    //       ])
    //     }
    //   }

    //   if (selection && !!selected) {
    //     selected$.next([selected[0] || encode({ c: x, r: y }), encode({ c: x, r: y })])
    //   }
    // })
  }

  // for debug
  // selected$.subscribe((selected) => {
  //   console.log("selected", selected)
  // })
  // extended$.subscribe((extended) => {
  //   console.log("extended", extended)
  // })

  return [
    {
      topExtendStyle,
      rightExtendStyle,
      bottomExtendStyle,
      leftExtendStyle,
      extension: extension$,

      topSelectStyle,
      rightSelectStyle,
      bottomSelectStyle,
      leftSelectStyle,

      colLineStyle,
      rowLineStyle,

      squareStyle,
      selectSize
    },
    {
      watchCellSelection,
      computeCellExtendStyle
    }
  ] as const
}
