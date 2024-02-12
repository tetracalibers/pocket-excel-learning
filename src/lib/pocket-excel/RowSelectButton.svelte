<script lang="ts">
  export let rowNumber: number
  export let select: (colNumber: number) => void
  export let selected: boolean = false
</script>

<button type="button" on:click={() => select(rowNumber)} class:selected={selected}>
  {rowNumber}
</button>

<style>
  button {
    border: none;
    background: none;
    appearance: none;
    box-sizing: border-box;

    font-family: var(--excel__font);
    font-weight: var(--excel__font-weight);
    font-size: var(--excel__font-size);

    padding: 0.5ch;
    min-width: 3ch;
    position: absolute;
    inset: 0;
  }

  button.selected {
    background-color: var(--excel__header_cell__active-color);
  }
</style>
