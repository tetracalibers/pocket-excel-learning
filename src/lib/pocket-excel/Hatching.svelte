<script lang="ts">
  export let left: number
  export let top: number
  export let width: number
  export let height: number
  export let cellHeight: number

  const px = (n: number) => `${n}px`
</script>

<div
  class="hatching"
  style:--left={px(left)}
  style:--top={px(top)}
  style:--width={px(width)}
  style:--height={px(height)}
  style:--cell-height={px(cellHeight)}
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
    width: 100%;
    height: calc(100% - var(--cell-height));
    margin-top: var(--cell-height);
    background-color: var(--excel__hatching__background-color);
  }
</style>
