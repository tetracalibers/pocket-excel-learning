<script lang="ts">
  import SelectOverlay from "./components/overlay/SelectOverlay.svelte"
  import ExtendOverlay from "./components/overlay/ExtendOverlay.svelte"
  import DraggableSquare from "./components/overlay/DraggableSquare.svelte"
  // import CellValueEditor from "./components/cell/CellValueEditor.svelte"
  import ExTable from "./ExTable.svelte"
  import { useSpreadSheet } from "./hooks/use-sheet"
  import { getHeaders, toTableArray } from "./utils/data"

  export let data: Array<Record<string, unknown>> = []

  let headers = getHeaders(data)
  let table = toTableArray(data, headers)

  const [
    {
      topExtendStyle,
      rightExtendStyle,
      bottomExtendStyle,
      leftExtendStyle,
      extension,
      topSelectStyle,
      rightSelectStyle,
      bottomSelectStyle,
      leftSelectStyle,
      colLineStyle,
      rowLineStyle,
      squareStyle
    },
    { watchCellSelection, computeCellExtendStyle }
  ] = useSpreadSheet(table)
</script>

<div>
  <!-- <CellValueEditor /> -->
  <div class="relative _table-wrapper" use:watchCellSelection>
    <ExTable table={table} computeCellExtendStyle={computeCellExtendStyle} />
    <ExtendOverlay
      extension={$extension}
      topStyle={$topExtendStyle}
      rightStyle={$rightExtendStyle}
      leftStyle={$leftExtendStyle}
      bottomStyle={$bottomExtendStyle}
    />
    <SelectOverlay
      topStyle={$topSelectStyle}
      rightStyle={$rightSelectStyle}
      leftStyle={$leftSelectStyle}
      bottomStyle={$bottomSelectStyle}
      colLineStyle={$colLineStyle}
      rowLineStyle={$rowLineStyle}
    />
    <DraggableSquare squareStyle={$squareStyle} />
  </div>
</div>

<style>
  ._table-wrapper {
    --table-height: calc(100dvh - var(--body-padding-y));
    display: grid;
    grid-template-rows: var(--table-height);
  }
</style>
