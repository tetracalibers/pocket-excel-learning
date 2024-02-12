<script lang="ts">
  export let left: number
  export let top: number
  export let width: number
  export let height: number
  export let cellHeight: number
  export let cellWidth: number
  export let layout: "COLUMN" | "ROW" | "ALL"

  const px = (n: number) => `${n}px`
</script>

<div
  class="hatching"
  style:--left={px(left)}
  style:--top={px(top)}
  style:--width={px(width)}
  style:--height={px(height)}
  style:--cell-height={px(cellHeight)}
  style:--cell-width={px(cellWidth)}
  class:--layout-column={layout === "COLUMN"}
  class:--layout-row={layout === "ROW"}
  class:--layout-fill={layout === "ALL"}
></div>

<style>
  .hatching {
    position: absolute;
    top: var(--top);
    left: var(--left);

    display: block;
    width: var(--width);
    height: var(--height);

    outline: 2px solid var(--excel__cell__highlight-color);
    outline-offset: -1px;
    pointer-events: none;
  }

  .hatching::after {
    content: "";
    display: block;
    background-color: var(--excel__hatching__background-color);
  }

  .hatching.--layout-column::after {
    width: 100%;
    height: calc(100% - var(--cell-height));
    margin-top: var(--cell-height);
  }

  .hatching.--layout-row::after {
    width: calc(100% - var(--cell-width));
    height: 100%;
    margin-left: var(--cell-width);
  }

  .hatching.--layout-fill::after {
    width: 100%;
    height: 100%;
    clip-path: polygon(
      var(--cell-width) 0,
      100% 0,
      100% 100%,
      0 100%,
      0 var(--cell-height),
      var(--cell-width) var(--cell-height)
    );
  }
</style>
