<script lang="ts">
  import { onMount } from "svelte"
  import Cell from "./Cell.svelte"
  import RowSelectButton from "./RowSelectButton.svelte"
  import ColumnSelectButton from "./ColumnSelectButton.svelte"
  import AllCellSelectButton from "./AllCellSelectButton.svelte"
  import { useSpreadsheet } from "./use-spread-sheet.ts"

  export let data: Array<Record<string, unknown>> = []

  const header = (() => {
    // Object.keysの要素数が最も大きいものを採用
    const keys = data.map((row) => Object.keys(row))
    const header = keys.reduce((acc, cur) => {
      return cur.length > acc.length ? cur : acc
    }, [])
    return header
  })()

  let table: HTMLTableElement
  const [{ activeCell, activeCellElement }, { navigate, selectCell }] = useSpreadsheet(table)
</script>

<table bind:this={table} use:navigate>
  <tbody>
    <tr>
      <th scope="col">
        <AllCellSelectButton />
      </th>
      {#each header as _, i}
        <th scope="col">
          <ColumnSelectButton colNumber={i + 1} />
        </th>
      {/each}
    </tr>
    <tr>
      <th scope="row">
        <RowSelectButton rowNumber={1} />
      </th>
      {#each header as key, columnNumber}
        <td data-cell data-cell-column={columnNumber + 1} data-cell-row={1}>
          <Cell value={key} setAsActiveCell={() => selectCell(1, columnNumber + 1)} />
        </td>
      {/each}
    </tr>
    {#each data as row, rowNumber}
      <tr>
        <th scope="row">
          <RowSelectButton rowNumber={rowNumber + 2} />
        </th>
        {#each header as key, columnNumber}
          <td data-cell data-cell-column={columnNumber + 1} data-cell-row={rowNumber + 2}>
            <Cell
              value={row[key]}
              setAsActiveCell={() => selectCell(rowNumber + 2, columnNumber + 1)}
            />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
    width: 100%;
    overflow-x: auto;
    font-family: var(--excel__font);
    font-weight: var(--excel__font-weight);
    font-size: var(--excel__font-size);
  }

  :where(td, th) {
    border: 1px solid var(--excel__cell__border-color);
    white-space: nowrap;
  }

  :where(th[scope="col"], th[scope="row"]) {
    border-color: var(--excel__header_cell__border-color);
    background-color: var(--excel__header_cell__background-color);
  }
</style>
