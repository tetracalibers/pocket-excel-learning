<script lang="ts">
  import type { Action } from "svelte/action"
  import AllCellSelector from "./components/header/AllCellSelector.svelte"
  import ColumnSelector from "./components/header/ColumnSelector.svelte"
  import RowSelector from "./components/header/RowSelector.svelte"
  import Cell from "./components/cell/Cell.svelte"

  export let table: unknown[][] = []
  export let computeCellExtendStyle: Action<HTMLTableElement>

  const [headers, ...data] = table
</script>

<table class="Excel-table" use:computeCellExtendStyle>
  <tbody>
    <tr>
      <th scope="col"><AllCellSelector /></th>
      {#each headers as header, c}
        <th scope="col">
          <ColumnSelector c={c} />
        </th>
      {/each}
    </tr>
    <tr>
      <th scope="row">
        <RowSelector r={0} />
      </th>
      {#each headers as header, c}
        <td>
          <Cell initialValue={header} r={0} c={c} />
        </td>
      {/each}
    </tr>
    {#each data as row, _r}
      {@const r = _r + 1}
      <tr>
        <th scope="row">
          <RowSelector r={r} />
        </th>
        {#each headers as key, c}
          <td>
            <Cell initialValue={row[c]} r={r} c={c} />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .Excel-table th {
    padding-block: 0;
  }
</style>
