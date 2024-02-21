<script lang="ts">
  import type { SquareStyle } from "@/lib/excel/hooks/use-sheet"
  import { px } from "@/lib/excel/utils/css.ts"

  export let squareStyle: SquareStyle
</script>

<div
  tabindex={-1}
  class="square absolute"
  id="square"
  style:left={px(squareStyle.left)}
  style:top={px(squareStyle.top)}
/>

<style>
  .absolute {
    position: absolute;
    z-index: 10;
    transition: all 0.1s linear;
  }

  .square {
    height: 8px;
    width: 8px;
    cursor: crosshair;
    border: 1px solid white;
    background: teal;
    transform: translate3D(-40%, -40%, 0);
  }
</style>
