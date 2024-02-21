<script lang="ts">
  import type {
    TopStyle,
    RightStyle,
    LeftStyle,
    BottomStyle,
    ColLineStyle,
    RowLineStyle
  } from "@/lib/excel/hooks/use-sheet"
  import { px } from "@/lib/excel/utils/css.ts"

  export let topStyle: TopStyle
  export let rightStyle: RightStyle
  export let leftStyle: LeftStyle
  export let bottomStyle: BottomStyle

  export let colLineStyle: ColLineStyle
  export let rowLineStyle: RowLineStyle
</script>

<div
  class="top-select absolute"
  style:width={px(topStyle.width)}
  style:left={px(topStyle.left)}
  style:top={px(topStyle.top)}
/>
<div
  class="bottom-select absolute"
  style:width={px(bottomStyle.width)}
  style:left={px(bottomStyle.left)}
  style:top={px(bottomStyle.top)}
/>
<div
  class="left-select absolute"
  style:height={px(leftStyle.height)}
  style:top={px(leftStyle.top)}
  style:left={px(leftStyle.left)}
/>
<div
  class="right-select absolute"
  style:height={px(rightStyle.height)}
  style:top={px(rightStyle.top)}
  style:left={px(rightStyle.left)}
/>

<div
  class="col-line absolute"
  style:width={px(colLineStyle.width)}
  style:left={px(colLineStyle.left)}
  style:top={px(colLineStyle.top)}
/>
<div
  class="row-line absolute"
  style:height={px(rowLineStyle.height)}
  style:top={px(rowLineStyle.top)}
  style:left={px(rowLineStyle.left)}
/>

<style>
  .absolute {
    position: absolute;
    z-index: 10;
    transition: all 0.1s linear;
  }

  .top-select,
  .bottom-select,
  .col-line {
    border-bottom: 2px solid teal;
  }
  .left-select,
  .right-select {
    border-left: 2px solid teal;
  }
  .row-line {
    border-right: 2px solid teal;
  }
</style>
