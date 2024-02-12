<script lang="ts">
  export let colNumber: number
  export let select: (colNumber: number) => void
  export let selected: boolean = false
</script>

<button type="button" on:click={() => select(colNumber)} class:selected={selected}>
  {String.fromCharCode("A".charCodeAt(0) + colNumber - 1)}
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

    padding: 8px;
    width: 100%;

    cursor: pointer;
  }

  button.selected {
    background-color: var(--excel__header_cell__active-color);
  }
</style>
