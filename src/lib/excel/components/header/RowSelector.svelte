<script lang="ts">
  export let r: number
</script>

<button type="button">
  {r + 1}
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
    display: grid;
    place-content: center;
  }
</style>
