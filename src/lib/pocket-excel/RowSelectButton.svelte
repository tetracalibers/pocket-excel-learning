<script lang="ts">
  export let rowNumber: number
</script>

<button type="button">
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

    background-color: var(--excel__header_cell__background-color);
    width: 100%;
    padding: 0.5ch;
    min-width: 3ch;
  }
</style>
