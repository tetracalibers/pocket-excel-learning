<script lang="ts">
  export let data: Array<Record<string, unknown>> = [];
  
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
  <thead>
    <tr>
      {#each header as key}
        <th>{key}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data as row, i}
      <tr>
        {#each header as key}
          <td>{row[key] ?? ""}</td>
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
  }

  :where(td, th) {
    border: 1px solid #ddd;
    padding: 8px;
    white-space: nowrap;
  }
</style>