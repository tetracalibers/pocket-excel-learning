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
      {#each header as _, i}
        <th scope="col"><ButtonCell value={String.fromCharCode("A".charCodeAt(0) + i)} /></th>
      {/each}
    </tr>
    <tr>
      {#each header as key}
        <th><Cell value={key} /></th>
      {/each}
    </tr>
    {#each data as row, i}
      <tr>
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
</style>
