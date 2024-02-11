<script lang="ts">
  import Cell from "./Cell.svelte"
  import ButtonCell from "./ButtonCell.svelte"

  export let data: Array<Record<string, unknown>> = []

  const header = (() => {
    // Object.keysの要素数が最も大きいものを採用
    const keys = data.map((row) => Object.keys(row))
    const header = keys.reduce((acc, cur) => {
      return cur.length > acc.length ? cur : acc
    }, [])
    return header
  })()
</script>

<table>
  <tbody>
    <tr>
      <th scope="col"></th>
      {#each header as _, i}
        <th scope="col"><ButtonCell>{String.fromCharCode("A".charCodeAt(0) + i)}</ButtonCell></th>
      {/each}
    </tr>
    <tr>
      <th scope="row"><ButtonCell>{1}</ButtonCell></th>
      {#each header as key}
        <th><Cell value={key} /></th>
      {/each}
    </tr>
    {#each data as row, i}
      <tr>
        <th scope="row"><ButtonCell>{i + 2}</ButtonCell></th>
        {#each header as key}
          <td><Cell value={row[key]} /></td>
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
