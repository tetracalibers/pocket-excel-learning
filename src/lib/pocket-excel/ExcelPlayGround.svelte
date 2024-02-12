<script lang="ts">
  import { onMount } from "svelte"
  import Cell from "./Cell.svelte"
  import RowSelectButton from "./RowSelectButton.svelte"
  import ColumnSelectButton from "./ColumnSelectButton.svelte"
  import AllCellSelectButton from "./AllCellSelectButton.svelte"
  import Hatching from "./Hatching.svelte"
  import CellValueEditor from "./CellValueEditor.svelte"
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
  ] = useSpreadsheet(table)

  $: isActiveCell = (r: number, c: number) => {
    return $activeCell.r === r && $activeCell.c === c
  }
</script>

<CellValueEditor bind:value={$activeCellDraftValue} />
<table bind:this={table} use:navigate use:hatching>
  <tbody>
    <tr>
      <th scope="col">
        <AllCellSelectButton select={selectAll} selected={$allSelected} />
      </th>
      {#each header as _, i}
        <th scope="col" class:--highlight={$activeCell.c === i + 1 || $activeRow}>
          <ColumnSelectButton
            colNumber={i + 1}
            select={selectColumn}
            selected={$activeColumn === i + 1 || $allSelected}
          />
        </th>
      {/each}
    </tr>
    <tr>
      <th scope="row" class:--highlight={$activeCell.r === 1 || $activeColumn}>
        <RowSelectButton
          rowNumber={1}
          select={selectRow}
          selected={$activeRow === 1 || $allSelected}
        />
      </th>
      {#each header as key, columnNumber}
        {@const c = columnNumber + 1}
        {@const isActive = isActiveCell(1, c)}
        <td>
          <Cell
            initialValue={key}
            setAsActiveCell={() => selectCell(1, c)}
            linkedEditor={{ value: $activeCellDraftValue, syncValue: editActiveCell }}
            active={isActive}
          />
        </td>
      {/each}
    </tr>
    {#each data as row, rowNumber}
      {@const r = rowNumber + 2}
      <tr>
        <th scope="row" class:--highlight={$activeCell.r === r || $activeColumn}>
          <RowSelectButton
            rowNumber={r}
            select={selectRow}
            selected={$activeRow === r || $allSelected}
          />
        </th>
        {#each header as key, columnNumber}
          {@const c = columnNumber + 1}
          {@const isActive = isActiveCell(r, c)}
          <td>
            <Cell
              initialValue={row[key]}
              setAsActiveCell={() => selectCell(r, c)}
              active={isActive}
              linkedEditor={{ value: $activeCellDraftValue, syncValue: editActiveCell }}
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
    width: 100%;
    overflow-x: auto;
    font-family: var(--excel__font);
    font-weight: var(--excel__font-weight);
    font-size: var(--excel__font-size);

    /** table-cellを［position:sticky;］で固定したときのボーダーが消える現象を解消 */
    border-collapse: separate;
    border-spacing: 0;
  }

  :where(td, th) {
    white-space: nowrap;
    padding: 0;
  }

  :where(td, th) + td {
    border-block-end: 1px solid var(--excel__cell__border-color);
    border-inline-end: 1px solid var(--excel__cell__border-color);
  }

  th {
    position: relative;
  }

  :where(th[scope="col"], th[scope="row"]) {
    background-color: var(--excel__header_cell__background-color);
  }

  th[scope="col"] {
    border-block: 1px solid var(--excel__header_cell__border-color);
  }
  th[scope="col"]:first-child {
    border-inline: 1px solid var(--excel__header_cell__border-color);
  }
  th[scope="col"] + th[scope="col"] {
    border-inline-end: 1px solid var(--excel__header_cell__border-color);
  }

  th[scope="row"] {
    border-inline: 1px solid var(--excel__header_cell__border-color);
    border-block-end: 1px solid var(--excel__header_cell__border-color);
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

  /** 固定表示 */
  th[scope="row"]:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
  }
  th[scope="col"] {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  th[scope="col"]:first-child {
    left: 0;
    z-index: 2;
  }
</style>
