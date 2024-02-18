<script lang="ts">
  export let selected: { column: number; row: number; all: boolean }
  export let table: { columns: number; rows: number }
  export let pos: { c: number; row: number }
</script>

<div
{/** 全セル選択 && 四隅 */}
  class:border_left-top={selected.all && pos.c === 1 && pos.r === 1}
  class:border_left-bottom={selected.all && pos.c === 1 && pos.r === table.rows}
  class:border_right-top={selected.all && pos.c === table.columns && pos.r === 1}
  class:border_right-bottom={selected.all && pos.c === table.columns && pos.r === table.rows}
  {/**  */}
  class:border_left={(selected.all && pos.c === 1) || (pos.c === 1 && pos.r === selected.row)}
  class:border_right={(selected.all && pos.c === table.columns) ||
    (pos.c === table.columns && pos.r === selected.row)}
  class:border_top={(selected.all && pos.r === 1) || (pos.r === 1 && pos.c === selected.column)}
  class:border_bottom={(selected.all && pos.r === table.rows) ||
    (pos.r === table.rows && pos.c === selected.column)}
  class:border_vertical={selected.column === pos.c}
  class:border_horizontal={selected.row === pos.r}
  class:highlight={selected.all || selected.column || selected.row}
/>
