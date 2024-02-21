<script lang="ts">
  import type { TopStyle, RightStyle, LeftStyle, BottomStyle } from "@/lib/excel/hooks/use-sheet"
  import { px } from "@/lib/excel/utils/css.ts"

  export let extension: boolean

  export let topStyle: TopStyle
  export let rightStyle: RightStyle
  export let leftStyle: LeftStyle
  export let bottomStyle: BottomStyle
</script>

<div
  class="top-extend absolute"
  class:hidden={!extension}
  style:width={px(topStyle.width)}
  style:left={px(topStyle.left)}
  style:top={px(topStyle.top)}
/>
<div
  class="bottom-extend absolute"
  class:hidden={!extension}
  style:width={px(bottomStyle.width)}
  style:left={px(bottomStyle.left)}
  style:top={px(bottomStyle.top)}
/>
<div
  class="left-extend absolute"
  class:hidden={!extension}
  style:height={px(leftStyle.height)}
  style:top={px(leftStyle.top)}
  style:left={px(leftStyle.left)}
/>
<div
  class="right-extend absolute"
  class:hidden={!extension}
  style:height={px(rightStyle.height)}
  style:top={px(rightStyle.top)}
  style:left={px(rightStyle.left)}
/>

<style>
  .absolute {
    position: absolute;
    z-index: 10;
    transition: all 0.1s linear;
  }

  .top-extend,
  .bottom-extend {
    border-bottom: 2px solid #aaa;
  }
  .left-extend,
  .right-extend {
    border-left: 2px solid #aaa;
  }

  .hidden {
    display: none;
  }
</style>
