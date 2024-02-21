<script lang="ts">
  export let c: number
</script>

<button type="button">
  {String.fromCharCode("A".charCodeAt(0) + c)}
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

    padding: 0 8px;
    width: 100%;
    display: grid;

    cursor: pointer;
  }
</style>
