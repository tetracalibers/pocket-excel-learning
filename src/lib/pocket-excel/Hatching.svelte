<script lang="ts">
  export let left: number
  export let top: number
  export let width: number
  export let height: number
  export let cellHeight: number
  export let cellWidth: number
  export let layout: "COLUMN" | "ROW" | "ALL"
  export let overflow: {
    top: boolean
    bottom: boolean
    left: boolean
    right: boolean
  }

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
  class:--overflow-top={overflow.top}
  class:--overflow-bottom={overflow.bottom}
  class:--overflow-left={overflow.left}
  class:--overflow-right={overflow.right}
></div>

<style>
  .hatching {
    --thickness: 2px;

    position: absolute;
    top: 0;
    left: 0;

    transform: translate(var(--left), var(--top));

    display: block;
    width: var(--width);
    height: var(--height);

    border: var(--thickness) solid var(--excel__cell__highlight-color);
    box-sizing: border-box;

    pointer-events: none;
  }

  .hatching.--layout-column,
  .hatching.--layout-fill {
    top: var(--thickness);
    height: calc(var(--height) - var(--thickness));
  }

  .hatching.--overflow-top {
    border-top: none;
  }
  .hatching.--overflow-bottom {
    border-bottom: none;
  }
  .hatching.--overflow-left {
    border-left: none;
  }
  .hatching.--overflow-right {
    border-right: none;
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
