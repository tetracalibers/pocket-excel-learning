<script lang="ts">
  import { onMount } from "svelte"
  import Cell from "./Cell.svelte"
  import RowSelectButton from "./RowSelectButton.svelte"
  import ColumnSelectButton from "./ColumnSelectButton.svelte"
  import AllCellSelectButton from "./AllCellSelectButton.svelte"
  import Hatching from "./Hatching.svelte"
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
  const [
    { activeCell, activeCellElement, activeColumn, hatchingArea },
    { navigate, selectCell, selectColumn, columnHighlight }
  ] = useSpreadsheet(table)
</script>

<table bind:this={table} use:navigate use:columnHighlight>
  <tbody>
    <tr>
      <th scope="col">
        <AllCellSelectButton />
      </th>
      {#each header as _, i}
        <th scope="col" class:--highlight={$activeCell.c === i + 1}>
          <ColumnSelectButton
            colNumber={i + 1}
            select={selectColumn}
            selected={$activeColumn === i + 1}
          />
        </th>
      {/each}
    </tr>
    <tr>
      <th scope="row" class:--highlight={$activeCell.r === 1 || $activeColumn}>
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
        <th scope="row" class:--highlight={$activeCell.r === rowNumber + 2 || $activeColumn}>
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
{#if $hatchingArea}
  <Hatching {...$hatchingArea} />
{/if}

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
    padding: 0;
  }

  th {
    position: relative;
  }

  :where(th[scope="col"], th[scope="row"]) {
    border-color: var(--excel__header_cell__border-color);
    background-color: var(--excel__header_cell__background-color);
  }

  :where(th[scope="col"], th[scope="row"]).--highlight {
    background-color: var(--excel__header_cell__background-color--highlight);
  }
  :where(th[scope="col"], th[scope="row"])::after {
    content: "";
    display: block;
    position: absolute;
  }
  :where(th[scope="col"])::after {
    bottom: -1px;
    width: calc(100% + 1px);
    height: 2px;
    right: -0.5px;
  }
  :where(th[scope="row"])::after {
    width: 2px;
    height: calc(100% + 1px);
    right: -1px;
    top: -0.5px;
  }
  :where(th[scope="col"], th[scope="row"]).--highlight::after {
    background-color: var(--excel__header_cell__highlight-color);
  }
</style>
