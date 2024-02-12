<script lang="ts">
  export let select: () => void
  export let selected: boolean = false
</script>

<button type="button" on:click={select} class:selected={selected}>
  <span class="triangle"></span>
</button>

<style>
  button {
    border: none;
    background: none;
    appearance: none;
    padding: 0.5ch;
    box-sizing: border-box;

    font-family: var(--excel__font);
    font-weight: var(--excel__font-weight);
    font-size: var(--excel__font-size);

    background-color: var(--excel__header_cell__background-color);
    width: 100%;
    height: 100%;
  }

  .triangle {
    display: block;
    background-color: rgb(183, 183, 183);
    padding: 1em;
    clip-path: polygon(100% 100%, 100% 0, 0 100%, 100% 100%);
  }

  button.selected > .triangle {
    background-color: var(--excel__header_cell__highlight-color);
  }
</style>
